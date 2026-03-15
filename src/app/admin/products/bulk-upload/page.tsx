"use client";
import { useState, useRef } from "react";
import Link from "next/link";

interface UploadError {
  row: number;
  message: string;
}

interface UploadResult {
  success: number;
  failed: number;
  errors: UploadError[];
}

export default function BulkUploadPage() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const csvInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);

  function handleCsvChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setCsvFile(file);
    setResult(null);
    setErrorMsg("");
  }

  function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setImageFiles(files);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!csvFile) {
      setErrorMsg("Please select a CSV file.");
      return;
    }

    setLoading(true);
    setResult(null);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("file", csvFile);
      for (const img of imageFiles) {
        formData.append("images", img);
      }

      const res = await fetch("/api/products/bulk-upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Upload failed");
      } else {
        setResult(data as UploadResult);
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function downloadTemplate() {
    const headers = [
      "title",
      "slug",
      "description",
      "price",
      "compareAtPrice",
      "color",
      "disposability",
      "stockCount",
      "status",
      "featured",
      "brandId",
      "categoryId",
      "imageFilenames",
    ];
    const sample = [
      "Sample Contact Lens",
      "",
      "A great contact lens",
      "1500",
      "2000",
      "Blue",
      "ONE_DAY",
      "50",
      "ACTIVE",
      "false",
      "",
      "",
      "lens_front.jpg,lens_back.jpg",
    ];
    const csv = [headers.join(","), sample.join(",")].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bulk_upload_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            <Link
              href="/admin/products"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "#6b7280",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              <i className="icon-arrow-left"></i>
              Back to Products
            </Link>
            <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700 }}>
              Bulk Upload Products
            </h1>
          </div>

          {/* Instructions */}
          <div
            style={{
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "12px",
              padding: "20px 24px",
              marginBottom: "28px",
            }}
          >
            <h3 style={{ margin: "0 0 10px", fontSize: "15px", color: "#1d4ed8" }}>
              How to use Bulk Upload
            </h3>
            <ol style={{ margin: 0, paddingLeft: "20px", color: "#374151", lineHeight: 1.8 }}>
              <li>
                Download the <strong>CSV Template</strong> below and fill in your product data.
              </li>
              <li>
                For images: in the <code>imageFilenames</code> column, list the image filenames
                separated by commas.{" "}
                <em>The filenames must exactly match the files you select in step 4.</em>
              </li>
              <li>Select your completed <strong>CSV file</strong>.</li>
              <li>Select all <strong>product images</strong> at once (you can multi-select).</li>
              <li>Click <strong>Upload Products</strong>.</li>
            </ol>
          </div>

          {/* Download Template */}
          <button
            onClick={downloadTemplate}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#f3f4f6",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "10px 18px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              marginBottom: "28px",
              color: "#374151",
            }}
          >
            <i className="icon-download"></i>
            Download CSV Template
          </button>

          {/* Upload Form */}
          <form onSubmit={handleSubmit}>
            <div
              style={{
                background: "#fff",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                padding: "28px",
                marginBottom: "24px",
              }}
            >
              {/* CSV Upload */}
              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{ display: "block", fontWeight: 600, marginBottom: "8px", fontSize: "14px" }}
                >
                  CSV File <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <div
                  onClick={() => csvInputRef.current?.click()}
                  style={{
                    border: "2px dashed #d1d5db",
                    borderRadius: "10px",
                    padding: "28px",
                    textAlign: "center",
                    cursor: "pointer",
                    background: csvFile ? "#f0fdf4" : "#fafafa",
                    borderColor: csvFile ? "#86efac" : "#d1d5db",
                    transition: "all 0.2s",
                  }}
                >
                  {csvFile ? (
                    <>
                      <div style={{ fontSize: "24px", marginBottom: "8px" }}>✅</div>
                      <div style={{ fontWeight: 600, color: "#166534" }}>{csvFile.name}</div>
                      <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                        {(csvFile.size / 1024).toFixed(1)} KB — Click to change
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: "32px", marginBottom: "8px" }}>📄</div>
                      <div style={{ fontWeight: 600, color: "#374151" }}>Click to select CSV file</div>
                      <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>
                        .csv format only
                      </div>
                    </>
                  )}
                  <input
                    ref={csvInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleCsvChange}
                    style={{ display: "none" }}
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label
                  style={{ display: "block", fontWeight: 600, marginBottom: "8px", fontSize: "14px" }}
                >
                  Product Images{" "}
                  <span style={{ fontWeight: 400, color: "#6b7280" }}>
                    (optional — select all at once)
                  </span>
                </label>
                <div
                  onClick={() => imgInputRef.current?.click()}
                  style={{
                    border: "2px dashed #d1d5db",
                    borderRadius: "10px",
                    padding: "28px",
                    textAlign: "center",
                    cursor: "pointer",
                    background: imageFiles.length > 0 ? "#eff6ff" : "#fafafa",
                    borderColor: imageFiles.length > 0 ? "#93c5fd" : "#d1d5db",
                    transition: "all 0.2s",
                  }}
                >
                  {imageFiles.length > 0 ? (
                    <>
                      <div style={{ fontSize: "24px", marginBottom: "8px" }}>🖼️</div>
                      <div style={{ fontWeight: 600, color: "#1e40af" }}>
                        {imageFiles.length} image{imageFiles.length > 1 ? "s" : ""} selected
                      </div>
                      <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                        {imageFiles.map((f) => f.name).join(", ")}
                      </div>
                      <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>
                        Click to change
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: "32px", marginBottom: "8px" }}>🖼️</div>
                      <div style={{ fontWeight: 600, color: "#374151" }}>
                        Click to select images
                      </div>
                      <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>
                        Hold Ctrl / Cmd to select multiple files
                      </div>
                    </>
                  )}
                  <input
                    ref={imgInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagesChange}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            </div>

            {/* Error */}
            {errorMsg && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#dc2626",
                  marginBottom: "20px",
                  fontSize: "14px",
                }}
              >
                {errorMsg}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !csvFile}
              style={{
                background: loading || !csvFile ? "#9ca3af" : "#111827",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "14px 32px",
                fontSize: "15px",
                fontWeight: 700,
                cursor: loading || !csvFile ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                transition: "background 0.2s",
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid #fff3",
                      borderTop: "2px solid #fff",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  Uploading... This may take a while
                </>
              ) : (
                <>
                  <i className="icon-upload"></i>
                  Upload Products
                </>
              )}
            </button>
          </form>

          {/* Results */}
          {result && (
            <div
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "28px",
                marginTop: "28px",
              }}
            >
              <h2 style={{ margin: "0 0 20px", fontSize: "18px" }}>Upload Results</h2>

              <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
                <div
                  style={{
                    background: "#f0fdf4",
                    border: "1px solid #86efac",
                    borderRadius: "10px",
                    padding: "16px 24px",
                    textAlign: "center",
                    flex: 1,
                  }}
                >
                  <div style={{ fontSize: "32px", fontWeight: 700, color: "#16a34a" }}>
                    {result.success}
                  </div>
                  <div style={{ fontSize: "13px", color: "#166534", marginTop: "4px" }}>
                    Products Created
                  </div>
                </div>
                <div
                  style={{
                    background: result.failed > 0 ? "#fef2f2" : "#f9fafb",
                    border: `1px solid ${result.failed > 0 ? "#fecaca" : "#e5e7eb"}`,
                    borderRadius: "10px",
                    padding: "16px 24px",
                    textAlign: "center",
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      fontSize: "32px",
                      fontWeight: 700,
                      color: result.failed > 0 ? "#dc2626" : "#6b7280",
                    }}
                  >
                    {result.failed}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: result.failed > 0 ? "#991b1b" : "#6b7280",
                      marginTop: "4px",
                    }}
                  >
                    Failed
                  </div>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px" }}>
                    Row Errors
                  </h3>
                  <div
                    style={{
                      maxHeight: "320px",
                      overflowY: "auto",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  >
                    {result.errors.map((err, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "10px 16px",
                          borderBottom: idx < result.errors.length - 1 ? "1px solid #f3f4f6" : "none",
                          display: "flex",
                          gap: "12px",
                          fontSize: "13px",
                        }}
                      >
                        <span
                          style={{
                            background: "#fef2f2",
                            color: "#dc2626",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          Row {err.row}
                        </span>
                        <span style={{ color: "#374151" }}>{err.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.success > 0 && (
                <div style={{ marginTop: "20px" }}>
                  <Link
                    href="/admin/products"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "#111827",
                      color: "#fff",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontWeight: 600,
                      fontSize: "14px",
                    }}
                  >
                    View Products
                  </Link>
                </div>
              )}
            </div>
          )}

          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
        </div>
      </div>
    </div>
  );
}
