"use client";
import React, { useState, useEffect } from "react";

// const API_URL = "http://localhost:5000/api/bills";
const API_URL = "https://w2nproject.onrender.com/api/bills";

import type { Bill, FormData } from "@/types";

const Page = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    category: "",
    amount: "",
    note: "",
    date: "",
    files: [],
  });
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch bills");
      const data = await response.json();
      setBills(data);
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, files: Array.from(files) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("category", formData.category);
    form.append("amount", formData.amount);
    form.append("note", formData.note);
    form.append("date", formData.date);

    formData.files.forEach((file) => form.append("files", file));
    try {
      const response = await fetch(`${API_URL}/add`, {
        method: "POST",
        body: form,
      });

      if (!response.ok) throw new Error("Failed to add bill");

      setFormData({
        name: "",
        category: "",
        amount: "",
        note: "",
        date: "",
        files: [],
      });
      fetchBills();
    } catch (error) {
      console.error("Error adding bill:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete bill");
      fetchBills();
    } catch (error) {
      console.error("Error deleting bill:", error);
    }
  };

  const handleDescribe = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    setAnalysis(null);

    try {
      const response = await fetch(`${API_URL}/describe`);
      if (!response.ok) throw new Error("Failed to get bill analysis");
      const data = await response.json();
      setAnalysis(data.message);
    } catch (error) {
      console.error("Error fetching bill analysis:", error);
      setAnalysis("Failed to fetch bill analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-w-screen p-5 flex flex-col gap-8 items-center justify-center text-black rounded-md drop-shadow-xl shadow-lg rounded-lg">
      <div className="flex items-center m-3">
        <img src="/way2news.png" alt="Way2News Logo" className="h-10 mr-2" />
        <h1 className="bg-amber-200 shadow-md text-2xl p-2 rounded-md">
          Bills Manager - track your bills
        </h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-300 flex flex-col items-center justify-center"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 m-4 gap-6 rounded-lg p-3">
          <div>
            <label htmlFor="name" className="block">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="p-2 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="category" className="block">
              Category
            </label>
            <input
              type="text"
              name="category"
              id="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="p-2 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="amount" className="block">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              id="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleInputChange}
              required
              className="p-2 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="note" className="block">
              Note
            </label>
            <textarea
              name="note"
              id="note"
              placeholder="Note"
              value={formData.note}
              onChange={handleInputChange}
              className="p-2 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="date" className="block">
              Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="p-2 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="files" className="block">
              Upload Files
            </label>
            <input
              type="file"
              id="files"
              name="files"
              multiple
              className="m-1"
              onChange={handleFileChange}
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white shadow-md p-2 m-2 rounded-lg"
        >
          Add Bill
        </button>
      </form>

      <hr />

      <h2 className="bg-amber-200 m-2 p-2 rounded-lg shadow-md">Bill List</h2>
      {bills.length === 0 ? (
        <p className="text-red text-2xl bg-white rounded-lg p-2 m-2">
          No bills found.
        </p>
      ) : (
        <div className="w-auto grid grid-cols-1 md:grid-cols-2 gap-2">
          {bills.map((bill) => (
            <div
              key={bill._id}
              className="bg-slate-300 min-w-64 p-3 flex flex-col rounded-sm shadow-md"
            >
              <h3 className="bg-blue-300 p-1 font-bold rounded-sm text-center">
                {bill.name}
              </h3>
              <p>Category: {bill.category}</p>
              <p>Amount: {bill.amount}</p>
              <p>Note: {bill.note}</p>
              <p>Date: {new Date(bill.date).toLocaleDateString()}</p>
              {bill.files.map((file, ind) => (
                <a
                  key={ind}
                  href={file.url}
                  target="_blank"
                  className="text-blue-700"
                >
                  {file.name}
                </a>
              ))}

              <button
                onClick={() => handleDelete(bill._id)}
                className="bg-red-400 p-2 m-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleDescribe}
        className="bg-green-600 text-white p-2 m-2 rounded-lg"
      >
        Describe Bills
      </button>

      {loading && <p>Loading analysis...</p>}
      {analysis && (
        <pre className="bg-gray-200 p-3 rounded-md text-wrap max-w-5xl">
          {analysis}
        </pre>
      )}
    </div>
  );
};

export default Page;
