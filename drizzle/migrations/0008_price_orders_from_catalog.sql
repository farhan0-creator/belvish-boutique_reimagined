CREATE TABLE public.product_prices (slug text PRIMARY KEY, name text NOT NULL, price integer NOT NULL CHECK (price > 0));
REVOKE ALL ON public.product_prices FROM anon, authenticated;
GRANT ALL ON public.product_prices TO service_role;
ALTER TABLE public.product_prices ENABLE ROW LEVEL SECURITY;
INSERT INTO public.product_prices (slug, name, price) VALUES
('aurum-extrait','Aurum Extrait',48500),
('alba-rose','Alba',32800),
('oud-saffron-royal','Oud Safran Royal',56000),
('figuier-marin','Figuier Marin',21400),
('iris-poudre-imperial','Iris Poudré Impérial',44200),
('tabac-vanille-noir','Tabac Vanille Noir',29600),
('solstice-no-04','Solstice No. 04',19800),
('sunday-linen','Sunday Linen',12800),
('white-bloom','White Bloom',17200),
('quiet-current','Quiet Current',22500),
('citrus-study','Citrus Study',9800),
('amber-library','Amber Library',11500),
('nuit-de-jasmin','Nuit de Jasmin',38900),
('santal-blanc-mysore','Santal Blanc Mysore',34500);

CREATE OR REPLACE FUNCTION public.price_order_from_catalog() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  line jsonb; p record; q integer; priced jsonb := '[]'::jsonb; sub integer := 0;
BEGIN
  IF jsonb_typeof(NEW.items) <> 'array' OR jsonb_array_length(NEW.items) = 0 OR jsonb_array_length(NEW.items) > 30 THEN
    RAISE EXCEPTION 'Invalid order items';
  END IF;
  FOR line IN SELECT * FROM jsonb_array_elements(NEW.items) LOOP
    SELECT * INTO p FROM public.product_prices WHERE slug = line->>'slug';
    IF NOT FOUND THEN RAISE EXCEPTION 'Unknown product'; END IF;
    q := (line->>'qty')::integer;
    IF q IS NULL OR q < 1 OR q > 10 THEN RAISE EXCEPTION 'Invalid quantity'; END IF;
    priced := priced || jsonb_build_array(jsonb_build_object('slug', p.slug, 'name', p.name, 'qty', q, 'unitPrice', p.price, 'lineTotal', p.price * q));
    sub := sub + p.price * q;
  END LOOP;
  NEW.items := priced; NEW.subtotal := sub; NEW.shipping := 0; NEW.cod_fee := 0; NEW.total := sub;
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.price_order_from_catalog() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER orders_price_from_catalog BEFORE INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION public.price_order_from_catalog();