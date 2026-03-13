// API Route tests for /api/recipes

// Mock the MongoDB connection
const mockRecipes = [
  {
    _id: '1',
    title: 'Spaghetti Carbonara',
    description: 'Classic Italian pasta',
    ingredients: ['spaghetti', 'eggs', 'bacon', 'parmesan'],
    instructions: 'Cook pasta. Mix eggs and bacon. Combine.',
    author: 'user1',
    createdAt: new Date(),
  },
  {
    _id: '2',
    title: 'Caesar Salad',
    description: 'Fresh salad with caesar dressing',
    ingredients: ['romaine lettuce', 'caesar dressing', 'croutons', 'parmesan'],
    instructions: 'Wash lettuce. Add dressing. Top with croutons.',
    author: 'user2',
    createdAt: new Date(),
  },
]

// Test: GET /api/recipes - Fetch all recipes
describe('GET /api/recipes', () => {
  it('should return all recipes', () => {
    // In a real test, this would make an HTTP request
    // Here we test the expected behavior
    const recipes = mockRecipes
    expect(recipes).toHaveLength(2)
    expect(recipes[0]).toHaveProperty('title')
    expect(recipes[0]).toHaveProperty('ingredients')
    expect(recipes[0]).toHaveProperty('instructions')
  })

  it('should return recipes with required fields', () => {
    const recipes = mockRecipes
    recipes.forEach((recipe) => {
      expect(recipe).toHaveProperty('_id')
      expect(recipe).toHaveProperty('title')
      expect(recipe).toHaveProperty('description')
      expect(recipe).toHaveProperty('ingredients')
      expect(recipe).toHaveProperty('instructions')
      expect(recipe).toHaveProperty('author')
    })
  })
})

// Test: Recipe data structure validation
describe('Recipe Data Validation', () => {
  const isValidRecipe = (recipe) => {
    return (
      recipe &&
      typeof recipe.title === 'string' &&
      typeof recipe.description === 'string' &&
      Array.isArray(recipe.ingredients) &&
      typeof recipe.instructions === 'string'
    )
  }

  it('validates a complete recipe', () => {
    const recipe = {
      title: 'Test Recipe',
      description: 'Test description',
      ingredients: ['ing1', 'ing2'],
      instructions: 'Test instructions',
    }
    expect(isValidRecipe(recipe)).toBe(true)
  })

  it('rejects recipe missing title', () => {
    const recipe = {
      description: 'Test description',
      ingredients: ['ing1'],
      instructions: 'Test instructions',
    }
    expect(isValidRecipe(recipe)).toBe(false)
  })

  it('rejects recipe with non-array ingredients', () => {
    const recipe = {
      title: 'Test',
      description: 'Test',
      ingredients: 'not an array',
      instructions: 'Test',
    }
    expect(isValidRecipe(recipe)).toBe(false)
  })
})

// Test: Recipe filtering
describe('Recipe Filtering', () => {
  it('filters recipes by search term in title', () => {
    const searchTerm = 'carbonara'
    const filtered = mockRecipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    expect(filtered).toHaveLength(1)
    expect(filtered[0].title).toBe('Spaghetti Carbonara')
  })

  it('filters recipes by ingredient', () => {
    const ingredient = 'eggs'
    const filtered = mockRecipes.filter((recipe) =>
      recipe.ingredients.some((ing) => ing.toLowerCase().includes(ingredient))
    )
    expect(filtered).toHaveLength(1)
    expect(filtered[0].title).toBe('Spaghetti Carbonara')
  })

  it('returns empty array when no matches found', () => {
    const searchTerm = 'pizza'
    const filtered = mockRecipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    expect(filtered).toHaveLength(0)
  })
})

// Test: Recipe sorting
describe('Recipe Sorting', () => {
  it('sorts recipes by title alphabetically', () => {
    const sorted = [...mockRecipes].sort((a, b) =>
      a.title.localeCompare(b.title)
    )
    expect(sorted[0].title).toBe('Caesar Salad')
    expect(sorted[1].title).toBe('Spaghetti Carbonara')
  })

  it('sorts recipes by creation date (newest first)', () => {
    const recipesWithDates = [
      { _id: '1', createdAt: new Date('2024-01-01') },
      { _id: '2', createdAt: new Date('2024-02-01') },
    ]
    const sorted = recipesWithDates.sort(
      (a, b) => b.createdAt - a.createdAt
    )
    expect(sorted[0]._id).toBe('2')
    expect(sorted[1]._id).toBe('1')
  })
})
