-- Database migration to add Material Passport and Provenance tables

-- 1. Create material_batches table
CREATE TABLE IF NOT EXISTS material_batches (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  passport_id text NOT NULL UNIQUE,
  material_type text NOT NULL,
  species text NOT NULL,
  grade text NOT NULL,
  supplier_name text NOT NULL,
  supplier_batch_id text NOT NULL,
  invoice_number text NOT NULL,
  purchased_quantity numeric NOT NULL,
  allocated_quantity numeric NOT NULL,
  remaining_quantity numeric NOT NULL,
  quantity_unit text NOT NULL DEFAULT 'kg',
  purchase_date date NOT NULL,
  status text NOT NULL CHECK (status IN ('pending_client_review', 'sample_pending', 'ready_for_review', 'client_approved', 'client_requested_more_evidence', 'rejected')),
  sample_id text,
  sample_status text NOT NULL DEFAULT 'none' CHECK (sample_status IN ('none', 'required', 'prepared', 'shipped', 'received', 'verified')),
  sample_tracking_number text,
  sample_shipped_at timestamptz,
  sample_received_at timestamptz,
  sample_verified_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Create material_evidence table
CREATE TABLE IF NOT EXISTS material_evidence (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  material_batch_id uuid NOT NULL REFERENCES material_batches(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('invoice', 'receipt', 'cert_doc', 'supplier_info', 'raw_full', 'grain_closeup', 'angle_additional', 'video', 'process_cut', 'process_join', 'process_assem', 'process_finish', 'final_furniture')),
  storage_path text NOT NULL,
  file_hash text NOT NULL,
  captured_at timestamptz,
  uploaded_at timestamptz DEFAULT now(),
  verification_status text NOT NULL CHECK (verification_status IN ('uploaded', 'approved', 'rejected')),
  created_by uuid NOT NULL,
  replaced_evidence_id uuid REFERENCES material_evidence(id) ON DELETE SET NULL
);

-- 3. Create certification_records table
CREATE TABLE IF NOT EXISTS certification_records (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_batch_id uuid NOT NULL REFERENCES material_batches(id) ON DELETE CASCADE,
  type text NOT NULL,
  certificate_number text NOT NULL,
  issuing_authority text NOT NULL,
  issuer_name text NOT NULL,
  issued_at date not null,
  expires_at date,
  document_url text NOT NULL,
  verification_status text NOT NULL CHECK (verification_status IN ('UPLOADED', 'PENDING_REVIEW', 'VERIFIED', 'EXPIRED', 'REJECTED')),
  verification_notes text,
  verified_at timestamptz
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE material_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_records ENABLE ROW LEVEL SECURITY;

-- 5. Policies for material_batches
CREATE POLICY "Users can view own material batches"
ON material_batches FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = material_batches.order_id
    AND (auth.uid() = orders.buyer_id OR auth.uid() = orders.artisan_id)
  )
);

CREATE POLICY "Artisans can insert own material batches"
ON material_batches FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = material_batches.order_id
    AND auth.uid() = orders.artisan_id
  )
);

CREATE POLICY "Users can update own material batches"
ON material_batches FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = material_batches.order_id
    AND (auth.uid() = orders.buyer_id OR auth.uid() = orders.artisan_id)
  )
);

-- 6. Policies for material_evidence
CREATE POLICY "Users can view own evidence"
ON material_evidence FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = material_evidence.order_id
    AND (auth.uid() = orders.buyer_id OR auth.uid() = orders.artisan_id)
  )
);

CREATE POLICY "Artisans can insert own evidence"
ON material_evidence FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = material_evidence.order_id
    AND auth.uid() = orders.artisan_id
  )
);

CREATE POLICY "Artisans can update own evidence"
ON material_evidence FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = material_evidence.order_id
    AND auth.uid() = orders.artisan_id
  )
);

-- 7. Policies for certification_records
CREATE POLICY "Users can view own certifications"
ON certification_records FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM material_batches
    JOIN orders ON orders.id = material_batches.order_id
    WHERE material_batches.id = certification_records.material_batch_id
    AND (auth.uid() = orders.buyer_id OR auth.uid() = orders.artisan_id)
  )
);

CREATE POLICY "Artisans can insert own certifications"
ON certification_records FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM material_batches
    JOIN orders ON orders.id = material_batches.order_id
    WHERE material_batches.id = certification_records.material_batch_id
    AND auth.uid() = orders.artisan_id
  )
);

CREATE POLICY "Users can update own certifications"
ON certification_records FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM material_batches
    JOIN orders ON orders.id = material_batches.order_id
    WHERE material_batches.id = certification_records.material_batch_id
    AND (auth.uid() = orders.buyer_id OR auth.uid() = orders.artisan_id)
  )
);
