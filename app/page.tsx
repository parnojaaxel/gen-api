"use client"

import React, { useState, useEffect } from 'react';

interface Recipe {
  id: number;
  title: string;
  body: string;
}

const RecipesPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const apiUrl = 'https://usman-fake-api.herokuapp.com/api/recipes';

  const fetchRecipes = async () => {
    try {
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        setRecipes(data);
      } else {
        console.error('Ei õnnestunud retsepte tuua');
      }
    } catch (error) {
      console.error('Tekkis viga:', error);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const createRecipe = async () => {
    const newRecipe: Recipe = {
      id: 0,
      title: 'Uus retsept',
      body: 'Uue retsepti kirjeldus',
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecipe),
      });
      if (response.ok) {
        fetchRecipes();
      } else {
        console.error('Ei õnnestunud uut retsepti luua');
      }
    } catch (error) {
      console.error('Tekkis viga:', error);
    }
  };

  const updateRecipe = async (recipeId: number) => {
    const updateUrl = `${apiUrl}/${recipeId}`;
    const updatedRecipe: Recipe = {
      id: recipeId,
      title: editingRecipe?.title || '',
      body: editingRecipe?.body || '',
    };

    try {
      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRecipe),
      });
      if (response.ok) {
        fetchRecipes();
      } else {
        console.error('Ei õnnestunud retsepti uuendada');
      }
    } catch (error) {
      console.error('Tekkis viga:', error);
    }
  };

  const deleteRecipe = async (recipeId: number) => {
    const deleteUrl = `${apiUrl}/${recipeId}`;

    try {
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchRecipes();
      } else {
        console.error('Ei õnnestunud retseptit kustutada');
      }
    } catch (error) {
      console.error('Tekkis viga:', error);
    }
  };

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editingRecipe) {
      updateRecipe(editingRecipe.id);
      setEditingRecipe(null);
      setIsEditing(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Retseptide nimekiri</h1>
      <div className="mb-4">
        <button onClick={createRecipe} className="bg-blue-500 text-white px-3 py-2 rounded mr-4">
          Loo
        </button>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recipes.map((recipe) => (
          <li key={recipe.id} className="bg-white p-4 rounded shadow-md flex flex-col">
            {editingRecipe === recipe ? (
              <div>
                <input
                  type="text"
                  value={editingRecipe?.title || ''}
                  onChange={(e) =>
                    setEditingRecipe({ ...editingRecipe, title: e.target.value })
                  }
                  className="mb-2 px-2 py-1 rounded text-black"
                />
                <input
                  type="text"
                  value={editingRecipe?.body || ''}
                  onChange={(e) =>
                    setEditingRecipe({ ...editingRecipe, body: e.target.value })
                  }
                  className="mb-2 px-2 py-1 rounded text-black"
                />
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-black">{recipe.title}</h3>
                <p className="text-gray-500 mb-2">{recipe.body}</p>
              </div>
            )}
            <div>
              <button
                onClick={() => {
                  if (editingRecipe === recipe) {
                    handleSave();
                  } else {
                    handleEdit(recipe);
                  }
                }}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mb-2"
              >
                {editingRecipe === recipe ? 'Salvesta' : 'Muuda'}
              </button>
              <button
                onClick={() => deleteRecipe(recipe.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover-bg-red-600"
              >
                Kustuta
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipesPage;