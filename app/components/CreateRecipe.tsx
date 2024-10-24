'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CldUploadWidget } from 'next-cloudinary';
import {Recipe} from '../types'


const CreateRecipePage: React.FC = () => {
  const { userId } = useAuth();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe>({
    id: 0,
    title: '',
    image: '',
    ingredients: [''],
    instructions: '',
    authorId: ''
  });
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecipe((prev) => ({ ...prev, [name]: value }));
  };
  const handleIngredientChange = (index: number, value: string) => {
    setRecipe((prev) => {
      const newIngredients = [...prev.ingredients];
      newIngredients[index] = value;
      return { ...prev, ingredients: newIngredients };
    });
  };

  const addIngredient = () => {
    setRecipe((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ''],
    }));
  };

  const handleImageUpload = (result: any) => {
    setRecipe((prev) => ({ ...prev, image: result.info.secure_url }));
  };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) {
      alert('You must be logged in to create a recipe');
      return;
    }

    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...recipe, authorId: userId}),
      });

      if (response.ok) {
        router.push('/');
      } else {
        throw new Error('Failed to create recipe');
      }
    } catch (error) {
      console.error('Error creating recipe:', error);
      alert('Failed to create recipe. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5faf7] text-gray-800 p-8">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-[#16A34A]">Create New Recipe</h1>
        
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2 font-semibold">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={recipe.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Recipe Image</label>
          <CldUploadWidget uploadPreset={`${process.env.UPLOAD_PRESET}`} onSuccess={handleImageUpload}>
            {({ open }) => (
              <button onClick={() => open()} className="px-4 py-2 bg-[#16A34A] text-white rounded-md hover:bg-[#138a3e]">
                Upload Image
              </button>
            )}
          </CldUploadWidget>
          {recipe.image && (
            <div className="mt-2">
              <Image src={recipe.image} alt="Recipe preview" width={200} height={200} className="rounded-md" />
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Ingredients</label>
          {recipe.ingredients.map((ingredient, index) => (
            <input
              key={index}
              type="text"
              value={ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
              className="w-full px-3 py-2 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              placeholder={`Ingredient ${index + 1}`}
            />
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="mt-2 px-4 py-2 bg-[#16A34A] text-white rounded-md hover:bg-[#138a3e] focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:ring-opacity-50"
          >
            Add Ingredient
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="instructions" className="block mb-2 font-semibold">Instructions</label>
          <textarea
            id="instructions"
            name="instructions"
            value={recipe.instructions}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-[#16A34A] text-white rounded-md hover:bg-[#138a3e] focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:ring-opacity-50"
        >
          Create Recipe
        </button>
      </form>
    </div>
  );
};

export default CreateRecipePage;