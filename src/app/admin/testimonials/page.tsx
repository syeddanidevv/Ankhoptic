"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Text,
  HStack,
  Grid,
  Image,
  Icon,
  Badge,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import {
  T,
  PageHeader,
  StatCard,
  TableShell,
  THead,
  TR,
  TD,
  EmptyRow,
  AdminButton,
  FormField,
  InputField,
  AdminModal,
  AdminLoader,
  SelectField,
  ConfirmDialog,
} from "@/components/admin/ui";
import toast from "react-hot-toast";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
  Star,
  MessageSquare,
  User,
  Trash2,
  Edit,
} from "lucide-react";

interface Testimonial {
  id: string;
  rating: number;
  heading: string;
  text: string;
  authorName: string;
  authorMeta: string | null;
  image: string | null;
  productName: string | null;
  productLink: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function TestimonialsPage() {
  const [data, setData] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [products, setProducts] = useState<
    { id: string; title: string; slug: string }[]
  >([]);

  // Form State
  const [formData, setFormData] = useState({
    rating: 5,
    heading: "",
    text: "",
    authorName: "",
    authorMeta: "",
    productName: "",
    productLink: "",
    image: "", // Base64 or existing URL
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/testimonials");
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);

      const prodRes = await fetch("/api/products?limit=1000");
      const prodJson = await prodRes.json();
      setProducts(prodJson.products || []);
    } catch {
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item?: Testimonial) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        rating: item.rating,
        heading: item.heading,
        text: item.text,
        authorName: item.authorName,
        authorMeta: item.authorMeta || "",
        productName: item.productName || "",
        productLink: item.productLink || "",
        image: item.image || "",
      });
      setPreviewUrl(item.image || "");
    } else {
      setEditingItem(null);
      setFormData({
        rating: 5,
        heading: "",
        text: "",
        authorName: "",
        authorMeta: "",
        productName: "",
        productLink: "",
        image: "",
      });
      setPreviewUrl("");
    }
    setPendingFile(null);
    setIsModalOpen(true);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async () => {
    if (!formData.authorName || !formData.text) {
      toast.error("Please fill in required fields");
      return;
    }

    setSubmitting(true);
    try {
      let finalImage = formData.image;

      if (pendingFile) {
        finalImage = await convertToBase64(pendingFile);
      }

      const payload = { ...formData, image: finalImage };
      const url = editingItem
        ? `/api/testimonials/${editingItem.id}`
        : "/api/testimonials";
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      toast.success(editingItem ? "Testimonial updated" : "Testimonial added");
      setIsModalOpen(false);
      fetchData();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch(`/api/testimonials/${itemToDelete}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Deleted successfully");
      setIsDeleteModalOpen(false);
      fetchData();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const toggleActive = async (item: Testimonial) => {
    try {
      const res = await fetch(`/api/testimonials/${item.id}`, {
        method: "PUT",
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      if (res.ok) {
        fetchData();
        toast.success(item.isActive ? "Deactivated" : "Activated");
      }
    } catch {
      toast.error("Action failed");
    }
  };

  if (loading && data.length === 0) return <AdminLoader />;

  return (
    <Box p={{ base: 4, md: 6 }} pb={20}>
      <PageHeader
        title="Testimonials & Reviews"
        subtitle="Manage customer stories shown on the homepage"
      >
        <AdminButton
          onClick={() => handleOpenModal()}
        >
          <Icon as={MessageSquare} />
          Add Review
        </AdminButton>
      </PageHeader>

      <Grid
        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
        gap={4}
        mb={8}
      >
        <StatCard
          label="Total Reviews"
          value={data.length}
          color={T.green}
        />
        <StatCard
          label="Active"
          value={data.filter((t) => t.isActive).length}
          color={T.green}
        />
        <StatCard
          label="Average Rating"
          value={(
            data.reduce((acc, curr) => acc + curr.rating, 0) /
            (data.length || 1)
          ).toFixed(1)}
          color={T.warn}
        />
      </Grid>

      <TableShell>
        <THead columns={["Author", "Review", "Rating", "Status", "Actions"]} />
        <tbody>
          {data.length === 0 ? (
            <EmptyRow cols={5} message="No reviews yet." />
          ) : (
            data.map((item, index) => (
              <TR key={item.id} index={index}>
              <TD>
                <HStack gap={3}>
                  <Box
                    w="40px"
                    h="40px"
                    borderRadius="full"
                    bg={T.bg}
                    overflow="hidden"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    border={`1px solid ${T.border}`}
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.authorName}
                        objectFit="cover"
                        w="full"
                        h="full"
                      />
                    ) : (
                      <Icon as={User} color={T.sub} />
                    )}
                  </Box>
                  <VStack align="start" gap={0}>
                    <Text fontWeight={700} fontSize="14px">
                      {item.authorName}
                    </Text>
                    <Text fontSize="12px" color={T.sub}>
                      {item.authorMeta || "Customer"}
                    </Text>
                  </VStack>
                </HStack>
              </TD>
              <TD style={{ maxWidth: "300px" }}>
                <Text fontWeight={600} fontSize="13px" lineClamp={1}>
                  {item.heading}
                </Text>
                <Text fontSize="12px" color={T.sub} lineClamp={2}>
                  {item.text}
                </Text>
              </TD>
              <TD>
                <HStack gap={1}>
                  <Text fontWeight={700} color={T.warn}>
                    {item.rating}
                  </Text>
                  <Icon as={Star} color={T.warn} fill={T.warn} boxSize={3} />
                </HStack>
              </TD>
              <TD>
                <Badge
                  colorScheme={item.isActive ? "green" : "gray"}
                  variant="subtle"
                  borderRadius="full"
                  px={2}
                  cursor="pointer"
                  onClick={() => toggleActive(item)}
                >
                  {item.isActive ? "Active" : "Hidden"}
                </Badge>
              </TD>
              <TD style={{ textAlign: "right" }}>
                <HStack gap={1} justify="end">
                  <IconButton
                    aria-label="Edit"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenModal(item)}
                  >
                    <Edit size={16} />
                  </IconButton>
                  <IconButton
                    aria-label="Delete"
                    variant="ghost"
                    size="sm"
                    colorScheme="red"
                    onClick={() => {
                      setItemToDelete(item.id);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </HStack>
              </TD>
            </TR>
          ))
        )}
        </tbody>
      </TableShell>

      {/* Add / Edit Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Edit Review" : "Add New Review"}
      >
        <VStack gap={4} align="stretch">
          <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={4}>
            <FormField label="Author Name" required>
              <InputField
                value={formData.authorName}
                onChange={(e) =>
                  setFormData({ ...formData, authorName: e.target.value })
                }
                placeholder="e.g. Syed Ali"
              />
            </FormField>
            <FormField label="Rating">
              <SelectField
                value={formData.rating.toString()}
                onChange={(e) =>
                  setFormData({ ...formData, rating: Number(e.target.value) })
                }
                options={[
                  { value: "5", label: "5 Stars" },
                  { value: "4", label: "4 Stars" },
                  { value: "3", label: "3 Stars" },
                  { value: "2", label: "2 Stars" },
                  { value: "1", label: "1 Star" },
                ]}
              />
            </FormField>
          </Grid>

          <FormField label="Author Subtitle (Meta)">
            <InputField
              value={formData.authorMeta}
              onChange={(e) =>
                setFormData({ ...formData, authorMeta: e.target.value })
              }
              placeholder="e.g. Customer from Karachi"
            />
          </FormField>

          <FormField label="Review Heading" required>
            <InputField
              value={formData.heading}
              onChange={(e) =>
                setFormData({ ...formData, heading: e.target.value })
              }
              placeholder="e.g. Amazing Quality!"
            />
          </FormField>

          <FormField label="Review Content" required>
            <textarea
              style={{
                width: "100%",
                padding: "12px",
                minHeight: "100px",
                border: `1px solid ${T.border}`,
                borderRadius: "8px",
                fontSize: "14px",
                outline: "none",
                fontFamily: "inherit",
              }}
              value={formData.text}
              onChange={(e) =>
                setFormData({ ...formData, text: e.target.value })
              }
              placeholder="What did the customer say?"
            />
          </FormField>

          <FormField label="Auto-fill from Store Products (Optional)">
            <SelectField
              value=""
              onChange={(e) => {
                const link = e.target.value;
                if (!link) return;
                const prod = products.find((p) => `/products/${p.slug}` === link);
                if (prod) {
                  setFormData({
                    ...formData,
                    productLink: link,
                    productName: prod.title,
                  });
                }
              }}
              options={[
                { value: "", label: "Select a Product to auto-fill..." },
                ...products.map((p) => ({
                  value: `/products/${p.slug}`,
                  label: p.title,
                })),
              ]}
            />
          </FormField>

          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
            <FormField label="Product Name">
              <InputField
                value={formData.productName}
                onChange={(e) =>
                  setFormData({ ...formData, productName: e.target.value })
                }
                placeholder="e.g. Ray-Ban Wayfarer"
              />
            </FormField>
            <FormField label="Product Link">
              <InputField
                value={formData.productLink}
                onChange={(e) =>
                  setFormData({ ...formData, productLink: e.target.value })
                }
                placeholder="/products/ray-ban"
              />
            </FormField>
          </Grid>

          <FormField label="Customer Avatar / Image">
            <ImageUpload
              value={formData.image}
              previewUrl={previewUrl}
              onChange={(val) => setFormData({ ...formData, image: val })}
              onPreview={(url) => setPreviewUrl(url)}
              onFileSelect={(file) => setPendingFile(file)}
              label="Select avatar"
            />
          </FormField>

          <HStack gap={3} w="full" justify="end" pt={4}>
            <AdminButton variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton
              loading={submitting}
              onClick={handleSubmit}
              variant="primary"
            >
              {editingItem ? "Update Review" : "Save Review"}
            </AdminButton>
          </HStack>
        </VStack>
      </AdminModal>

      <ConfirmDialog
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Review?"
        message="This action cannot be undone. This review will no longer appear on your store."
        danger
      />
    </Box>
  );
}
