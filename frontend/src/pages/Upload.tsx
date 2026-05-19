import React, { useState, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import PageMeta from "../components/common/PageMeta";
import {
  ShootingStarIcon,
  CheckCircleIcon,
  AlertIcon,
  TrashBinIcon
} from "../icons";
import { CloudUpload } from "lucide-react";
import Button from "../components/ui/button/Button";
import Input from "../components/form/input/InputField";
import Label from "../components/form/Label";
import { useNavigate } from "react-router";
import { API_BASE_URL } from "../config/api";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const token = authContext?.token;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setExtractedData(null);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError("");
    setExtractedData(null);

    const formData = new FormData();
    formData.append("bill", file);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/expense/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-auth-token": token,
          },
        }
      );

      setExtractedData(res.data);

      Swal.fire({
        icon: "success",
        title: "Extraction Complete!",
        text: "AI has successfully extracted the bill details. Please verify and confirm.",
        confirmButtonText: "Got it",
        confirmButtonColor: "#3b82f6",
      });

    } catch (err: any) {
      const errorMsg =
        err.response?.data?.msg ||
        "AI extraction failed. Please try a clearer image.";

      setError(errorMsg);

      Swal.fire({
        icon: "error",
        title: "Extraction Failed",
        text: errorMsg,
        confirmButtonText: "Try Again",
        confirmButtonColor: "#ef4444",
      });

    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!extractedData) return;

    setLoading(true);

    try {
      await axios.post(
        `${API_BASE_URL}/expense`,
        extractedData,
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Expense Saved!",
        text: "Your expense has been successfully saved to your history.",
        confirmButtonText: "Go to Dashboard",
        confirmButtonColor: "#3b82f6",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/Expenzoir/");
        }
      });

    } catch (err: any) {

      Swal.fire({
        icon: "error",
        title: "Failed to Save",
        text:
          err.response?.data?.msg ||
          "Failed to save expense. Please try again.",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#ef4444",
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageMeta
        title="Upload Bill | Expenzoir"
        description="Upload and scan your bills using Gemini AI"
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Scan New Bill
        </h1>

        <p className="text-gray-500 dark:text-gray-400">
          Let our AI extract the details for you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Upload Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">

          <Label className="mb-4">Bill Image</Label>

          <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-brand-500 transition-colors">

            {preview ? (
              <div className="space-y-4">

                <img
                  src={preview}
                  alt="Bill Preview"
                  className="max-h-64 mx-auto rounded-lg shadow-md"
                />

                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                >
                  <TrashBinIcon className="size-5" />
                </button>

              </div>

            ) : (
              <div className="space-y-4">

                <div className="flex justify-center">
                  <CloudUpload className="size-12 text-gray-400" />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Click to upload or drag and drop
                  </p>

                  <p className="text-xs text-gray-500">
                    SVG, PNG, JPG or WEBP (MAX. 5MB)
                  </p>
                </div>

                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>
            )}
          </div>

          <Button
            className="w-full mt-6"
            onClick={handleUpload}
            disabled={!file || loading}
          >
            {loading ? "AI Processing..." : "Extract with AI"}
          </Button>
        </div>

        {/* Details Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">

          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <ShootingStarIcon className="size-5 text-brand-500" />
            Extracted Details
          </h3>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 text-red-600 text-sm">
              <AlertIcon className="size-5 shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl flex gap-3 text-green-600 text-sm">
              <CheckCircleIcon className="size-5 shrink-0" />
              {success}
            </div>
          )}

          <div className="space-y-4">

            {/* Shop */}
            <div>
              <Label>Shop / Merchant</Label>

              <Input
                value={extractedData?.shop || ""}
                placeholder="Extract details first..."
                onChange={(e) =>
                  setExtractedData({
                    ...extractedData,
                    shop: e.target.value,
                  })
                }
              />
            </div>

            {/* Amount */}
            <div>
              <Label>Amount (₹)</Label>

              <Input
                type="number"
                value={extractedData?.amount || ""}
                placeholder="0.00"
                onChange={(e) =>
                  setExtractedData({
                    ...extractedData,
                    amount: parseFloat(e.target.value),
                  })
                }
              />
            </div>

            {/* Category */}
            <div>
              <Label>Category</Label>

              <select
                className="w-full h-11 px-4 text-sm bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:border-brand-500 dark:text-white"
                value={extractedData?.category || ""}
                onChange={(e) =>
                  setExtractedData({
                    ...extractedData,
                    category: e.target.value,
                  })
                }
              >
                <option value="">Select Category</option>
                <option value="Food">Food</option>
                <option value="Shopping">Shopping</option>
                <option value="Medical">Medical</option>
                <option value="Fuel">Fuel</option>
                <option value="Bills">Bills</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <Label>Payment Method</Label>

              <select
                className="w-full h-11 px-4 text-sm bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg outline-none focus:border-brand-500 dark:text-white"
                value={extractedData?.paymentMethod || ""}
                onChange={(e) =>
                  setExtractedData({
                    ...extractedData,
                    paymentMethod: e.target.value,
                  })
                }
              >
                <option value="">Select Payment Method</option>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Wallet">Wallet</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <Label>Date</Label>

              <Input
                type="date"
                value={
                  extractedData?.date
                    ? extractedData.date.split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setExtractedData({
                    ...extractedData,
                    date: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full mt-8"
            disabled={!extractedData || loading}
            onClick={handleConfirm}
          >
            Confirm & Save Expense
          </Button>
        </div>
      </div>
    </div>
  );
}
