-- SKCLOSET - Restock Notifications
-- Run this in your Supabase SQL editor after 001_initial_schema.sql

CREATE TABLE public.restock_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  notified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(email, variant_id)
);

ALTER TABLE public.restock_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own restock notifications" ON public.restock_notifications
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_restock_notifications_user_id ON public.restock_notifications(user_id);
CREATE INDEX idx_restock_notifications_variant_id ON public.restock_notifications(variant_id);
CREATE INDEX idx_restock_notifications_notified ON public.restock_notifications(notified) WHERE notified = FALSE;
