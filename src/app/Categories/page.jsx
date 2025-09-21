"use client";
import { useState } from "react";
import {
  Button,
  Input,
  Avatar,
  Switch,
  Spacer,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalContent,
} from "@heroui/react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Food", color: "bg-red-500", icon: "🍔" },
    { id: 2, name: "Travel", color: "bg-blue-500", icon: "✈️" },
    { id: 3, name: "Bills", color: "bg-yellow-500", icon: "💡" },
    { id: 4, name: "Shopping", color: "bg-pink-500", icon: "🛍️" },
    { id: 5, name: "Salary", color: "bg-green-500", icon: "💰" },
    { id: 6, name: "Investments", color: "bg-purple-500", icon: "📈" },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", icon: "📌", color: "bg-gray-500" });

  const addCategory = () => {
    if (newCategory.name.trim() !== "") {
      setCategories([...categories, { id: Date.now(), ...newCategory }]);
      setNewCategory({ name: "", icon: "📌", color: "bg-gray-500" });
      setIsOpen(false);
    }
  };

  const deleteCategory = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Categories</h1>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`p-5 rounded-xl shadow-md flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition ${cat.color} text-white`}
          >
            <span className="text-3xl">{cat.icon}</span>
            <p className="mt-2 font-semibold">{cat.name}</p>
            <Button
              size="sm"
              color="danger"
              className="mt-2"
              onPress={() => deleteCategory(cat.id)}
            >
              Delete
            </Button>
          </div>
        ))}

        {/* Add New Category */}
        <div
          className="p-5 rounded-xl shadow-md flex flex-col items-center justify-center border-2 border-dashed border-gray-400 cursor-pointer hover:bg-gray-100 transition"
          onClick={() => setIsOpen(true)}
        >
          <span className="text-3xl">➕</span>
          <p className="mt-2 font-semibold">Add Category</p>
        </div>
      </div>

      {/* Add Category Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent>
          <ModalHeader>Add New Category</ModalHeader>
          <ModalBody>
            <Input
              label="Category Name"
              placeholder="Enter category name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            />
            <Input
              label="Icon"
              placeholder="e.g. 🍔, ✈️"
              value={newCategory.icon}
              onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
            />
            <Input
              label="Color Class (Tailwind)"
              placeholder="e.g. bg-red-500"
              value={newCategory.color}
              onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" onPress={addCategory}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
