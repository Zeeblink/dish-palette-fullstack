"use client"
import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Recipe } from '../types'
import { useRouter } from 'next/navigation'

const UserRecipes = () => {
  const router = useRouter();
  // Change the type to accept number
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);

  const { userId } = useAuth();

  useEffect(() => {
    const fetchUserRecipes = async () => {
      const response = await fetch('/api/recipes', {
        method: 'GET'
      });
      const recipes: Recipe[] = await response.json();
      const userRecipes = recipes.filter(recipe => recipe.authorId === userId);
      setUserRecipes(userRecipes);
    };
    fetchUserRecipes();
  }, [userId]);

  // Toggle Menu
  const toggleMenu = (recipeId: number) => {
    setOpenMenuId(openMenuId === recipeId ? null : recipeId);
  };

  // Edit Recipe
  const editRecipe = (recipeId: number) => {
    router.push(`/edit-recipe/${recipeId}`)
  };

  // Update parameter type to number
  const deleteRecipe = async (recipeId: number) => {
    setOpenMenuId(null);
    try {
      const response = await fetch(`/api/recipes?id=${recipeId}`, {
        method: 'DELETE',
      });
      if(response.ok){
        setUserRecipes((prevRecipes) =>
          prevRecipes.filter((recipe) => recipe.id !== recipeId)
        );
        alert("Deleted Successfully")
        console.log("Deleted Successfully")
      } else {
        throw new Error("Failed to Delete")
      }
      // Add your delete logic here 
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {userRecipes.map((recipe) => (
        <div key={recipe.id} className="bg-white p-6 rounded shadow relative">
          <div className="relative h-40 w-full mb-4">
            <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
          </div>
          <h3 className="text-lg font-bold text-primary">{recipe.title}</h3>
          <p className="text-gray-500">Status: Published</p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <span>👍 200</span>
              <span>💬 30</span>
            </div>
            <div className="relative">
              <button
                onClick={() => toggleMenu(recipe.id)}
                className="text-gray-500 hover:text-gray-700 px-2"
              >
                •••
              </button>
              {openMenuId === recipe.id && (
                <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded shadow-lg z-10">
                  <ul className="py-1">
                    <li>
                      <button
                        onClick={() => editRecipe(recipe.id)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Edit
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => deleteRecipe(recipe.id)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default UserRecipes;