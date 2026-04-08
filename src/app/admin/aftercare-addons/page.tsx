"use client";
import { useState, useEffect } from "react";
import {
  Box, Text, HStack, VStack, Flex, Switch, Image
} from "@chakra-ui/react";
import {
  T, PageHeader, StatCard, SectionCard, FormField,
  InputField, SelectField, FieldError, AdminButton, AdminModal, AdminLoader,
  TableShell, THead, TR, TD, EmptyRow,
} from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/ImageUpload";
import toast from "react-hot-toast";

interface Addon {
  id: string;
  name: string;
  extraCharge: number;
  retailPrice: number;
  description: string | null;
  image: string | null;
  position: number;
  active: boolean;
  appliesTo: string;
}

interface FormState {
  name: string;
  extraCharge: string;
  retailPrice: string;
  description: string;
  image: string;
  appliesTo: string;
}
interface FormErrors { name?: string; extraCharge?: string; retailPrice?: string; appliesTo?: string; }

const EMPTY: FormState = { name: "", extraCharge: "", retailPrice: "", description: "", image: "", appliesTo: "" };

function validate(f: FormState): FormErrors {
  const e: FormErrors = {};
  if (!f.name.trim()) e.name = "Name is required";
  if (!f.extraCharge || isNaN(Number(f.extraCharge))) e.extraCharge = "Valid amount required";
  if (!f.retailPrice || isNaN(Number(f.retailPrice))) e.retailPrice = "Valid price required";
  if (!f.appliesTo) e.appliesTo = "Please select what this applies to";
  return e;
}

export default function AftercarePage() {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editing, setEditing] = useState<Addon | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // Image upload states
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetch_ = () => {
    setLoading(true);
    fetch("/api/aftercare-addons")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setAddons(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetch_(); }, []);

  const openAdd = () => { 
    setEditing(null); 
    setForm(EMPTY); 
    setErrors({}); 
    setPendingFile(null);
    setPreviewUrl(null);
    setModalOpen(true); 
  };
  
  const openEdit = (a: Addon) => {
    setEditing(a);
    setForm({ 
      name: a.name, 
      extraCharge: a.extraCharge.toString(), 
      retailPrice: a.retailPrice.toString(), 
      description: a.description ?? "", 
      image: a.image ?? "",
      appliesTo: a.appliesTo ?? ""
    });
    setErrors({});
    setPendingFile(null);
    setPreviewUrl(a.image ?? null);
    setModalOpen(true);
  };
  
  const openDelete = (a: Addon) => { setEditing(a); setDeleteModal(true); };

  const setObj = (k: keyof FormState, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      let finalImage = form.image;
      if (pendingFile) {
        setUploading(true);
        setUploadProgress(10); // Show some initial progress

        const fd = new FormData();
        fd.append("file", pendingFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });

        if (!uploadRes.ok) {
          const errData = await uploadRes.json().catch(() => ({}));
          throw new Error(errData.error || "Upload failed");
        }

        const data = await uploadRes.json();
        if (!data.url) throw new Error("Invalid upload response");

        finalImage = data.url;
        setObj("image", finalImage);
        setPendingFile(null);
        setUploading(false);
        setUploadProgress(100);
      }

      const url = editing ? `/api/aftercare-addons/${editing.id}` : "/api/aftercare-addons";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, { 
        method, 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ ...form, image: finalImage }) 
      });
      if (!res.ok) throw new Error();
      toast.success(editing ? "Addon updated!" : "Addon created!");
      setModalOpen(false);
      fetch_();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save addon");
      setUploading(false);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!editing) return;
    try {
      await fetch(`/api/aftercare-addons/${editing.id}`, { method: "DELETE" });
      toast.success("Addon deleted");
      setDeleteModal(false);
      fetch_();
    } catch {
      toast.error("Delete failed");
    }
  };

  const toggleActive = async (a: Addon) => {
    const updated = { ...a, active: !a.active };
    setAddons((prev) => prev.map((x) => (x.id === a.id ? updated : x)));
    try {
      await fetch(`/api/aftercare-addons/${a.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: updated.active }),
      });
    } catch {
      setAddons((prev) => prev.map((x) => (x.id === a.id ? a : x)));
      toast.error("Toggle failed");
    }
  };

  const activeCount = addons.filter((a) => a.active).length;

  if (loading) return <AdminLoader message="Loading aftercare addons..." />;

  return (
    <Box bg={T.bg} minH="100%" p={6}>
      <PageHeader
        title="Aftercare Add-ons"
        subtitle="Manage care kits offered at checkout with each lens order"
      >
        <AdminButton variant="primary" size="sm" onClick={openAdd}>+ Add Addon</AdminButton>
      </PageHeader>

      <HStack gap={4} mb={6} flexWrap="wrap">
        <StatCard label="Total Addons" value={addons.length} />
        <StatCard label="Active" value={activeCount} color={T.green} />
        <StatCard label="Inactive" value={addons.length - activeCount} color={T.red} />
      </HStack>

      <SectionCard title="All Aftercare Add-ons" subtitle="Toggle active/inactive or edit details">
        <TableShell showPagination={false}>
          <THead columns={["Image", "Name", "For", "Extra Charge", "Retail Price", "Description", "Status", "Actions"]} />
          <tbody>
            {addons.length === 0 && <EmptyRow cols={7} message="No aftercare addons yet — add one above." />}
            {addons.map((a, i) => (
              <TR key={a.id} index={i}>
                <TD>
                  {a.image ? (
                    <Box w="40px" h="40px" borderRadius="8px" border={`1px solid ${T.border}`} bg="white" display="flex" alignItems="center" justifyContent="center" overflow="hidden">
                      <Image src={a.image} alt={a.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </Box>
                  ) : (
                    <Box w="40px" h="40px" borderRadius="8px" border={`1px solid ${T.border}`} bg={T.bg} display="flex" alignItems="center" justifyContent="center">
                      <Text fontSize="18px">📦</Text>
                    </Box>
                  )}
                </TD>
                <TD>
                  <Text fontSize="13.5px" fontWeight={600} color={T.text}>{a.name}</Text>
                </TD>
                <TD>
                  <Box bg={T.bg} px={2} py={1} borderRadius="6px" display="inline-block">
                    <Text fontSize="12px" fontWeight={600} color={T.sub}>{a.appliesTo}</Text>
                  </Box>
                </TD>
                <TD>
                  <Text fontSize="13px" color={T.text}>Rs {a.extraCharge.toLocaleString()}</Text>
                </TD>
                <TD>
                  <Text fontSize="13px" color={T.text}>Rs {a.retailPrice.toLocaleString()}</Text>
                </TD>
                <TD>
                  <Text fontSize="12.5px" color={T.sub} overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" maxW="180px">
                    {a.description ?? "—"}
                  </Text>
                </TD>
                <TD>
                  <Switch.Root
                    checked={a.active}
                    onCheckedChange={() => toggleActive(a)}
                    colorPalette="green"
                    size="sm"
                  >
                    <Switch.HiddenInput />
                    <Switch.Control><Switch.Thumb /></Switch.Control>
                  </Switch.Root>
                </TD>
                <TD>
                  <HStack gap={2}>
                    <AdminButton variant="ghost" size="xs" onClick={() => openEdit(a)}>Edit</AdminButton>
                    <AdminButton variant="danger" size="xs" onClick={() => openDelete(a)}>Delete</AdminButton>
                  </HStack>
                </TD>
              </TR>
            ))}
          </tbody>
        </TableShell>
      </SectionCard>

      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Addon" : "Add Aftercare Addon"}
      >
        <VStack gap={4} align="stretch">
          
          <FormField label="Addon Image">
            <ImageUpload
              value={form.image || ""}
              previewUrl={previewUrl || ""}
              onChange={(img: string) => setObj("image", img)}
              onPreview={setPreviewUrl}
              onFileSelect={setPendingFile}
              uploadOnSelect={false}
              uploading={uploading}
              progress={uploadProgress}
              label="Drop image here or click to browse"
            />
          </FormField>

          <FormField label="Addon name" required>
            <InputField iconName="package" placeholder="e.g. Starter Kit"
              value={form.name} onChange={(e) => setObj("name", e.target.value)}
              isInvalid={!!errors.name}
            />
            <FieldError msg={errors.name} />
          </FormField>

          <FormField label="Applies To" required>
            <SelectField
              placeholder="Select type"
              value={form.appliesTo}
              onChange={(e) => setObj("appliesTo", e.target.value)}
              options={[
                { value: "LENS", label: "Lenses" },
                { value: "GLASSES", label: "Glasses" }
              ]}
              isInvalid={!!errors.appliesTo}
            />
            <FieldError msg={errors.appliesTo} />
          </FormField>

          <Flex gap={3}>
            <Box flex={1}>
              <FormField label="Extra charge (Rs)" required>
                <InputField type="number" placeholder="280"
                  value={form.extraCharge} onChange={(e) => setObj("extraCharge", e.target.value)}
                  isInvalid={!!errors.extraCharge}
                />
                <FieldError msg={errors.extraCharge} />
              </FormField>
            </Box>
            <Box flex={1}>
              <FormField label="Retail price (Rs)" required>
                <InputField type="number" placeholder="500"
                  value={form.retailPrice} onChange={(e) => setObj("retailPrice", e.target.value)}
                  isInvalid={!!errors.retailPrice}
                />
                <FieldError msg={errors.retailPrice} />
              </FormField>
            </Box>
          </Flex>

          <FormField label="Description (optional)">
            <InputField placeholder="Brief description of what's included"
              value={form.description} onChange={(e) => setObj("description", e.target.value)}
            />
          </FormField>

          <HStack gap={3} justify="flex-end" pt={2}>
            <AdminButton variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Cancel</AdminButton>
            <AdminButton variant="primary" size="sm" onClick={save} disabled={submitting || uploading}>
              {uploading ? "Uploading…" : submitting ? "Saving…" : editing ? "Save changes" : "Create addon"}
            </AdminButton>
          </HStack>
        </VStack>
      </AdminModal>

      <AdminModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Addon"
      >
        <Text fontSize="14px" color={T.text} mb={6}>
          Delete <strong>{editing?.name}</strong>? This cannot be undone.
        </Text>
        <HStack gap={3} justify="flex-end">
          <AdminButton variant="ghost" size="sm" onClick={() => setDeleteModal(false)}>Cancel</AdminButton>
          <AdminButton variant="danger" size="sm" onClick={confirmDelete}>Delete</AdminButton>
        </HStack>
      </AdminModal>
    </Box>
  );
}

