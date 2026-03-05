import { render, screen, fireEvent } from '@testing-library/react'

// Mock Next.js modules
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    query: {},
  }),
}))

jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: null,
    status: 'unauthenticated',
  }),
}))

// Simple Button component for testing
const Button = ({ onClick, children, disabled }) => (
  <button onClick={onClick} disabled={disabled}>
    {children}
  </button>
)

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})

// Simple Form Input component for testing
const FormInput = ({ label, value, onChange, type = 'text', required }) => (
  <div>
    <label htmlFor="input">{label}</label>
    <input
      id="input"
      type={type}
      value={value}
      onChange={onChange}
      required={required}
    />
  </div>
)

describe('FormInput Component', () => {
  it('renders label correctly', () => {
    render(<FormInput label="Recipe Name" />)
    expect(screen.getByLabelText(/recipe name/i)).toBeInTheDocument()
  })

  it('renders input with correct type', () => {
    render(<FormInput label="Email" type="email" />)
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email')
  })

  it('calls onChange when value changes', () => {
    const handleChange = jest.fn()
    render(<FormInput label="Title" value="" onChange={handleChange} />)
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Recipe' } })
    expect(handleChange).toHaveBeenCalled()
  })

  it('shows required attribute when required prop is true', () => {
    render(<FormInput label="Title" required />)
    expect(screen.getByLabelText(/title/i)).toHaveAttribute('required')
  })
})

// Recipe card display component (simplified for testing)
const RecipeCardDisplay = ({ title, description, cookingTime, difficulty }) => (
  <div data-testid="recipe-card">
    <h2>{title}</h2>
    <p>{description}</p>
    <span data-testid="cooking-time">{cookingTime}</span>
    <span data-testid="difficulty">{difficulty}</span>
  </div>
)

describe('RecipeCardDisplay Component', () => {
  const mockRecipe = {
    title: 'Spaghetti Carbonara',
    description: 'A classic Italian pasta dish',
    cookingTime: '30 mins',
    difficulty: 'Medium',
  }

  it('renders recipe title', () => {
    render(<RecipeCardDisplay {...mockRecipe} />)
    expect(screen.getByRole('heading', { name: /spaghetti carbonara/i })).toBeInTheDocument()
  })

  it('renders recipe description', () => {
    render(<RecipeCardDisplay {...mockRecipe} />)
    expect(screen.getByText(/classic italian pasta dish/i)).toBeInTheDocument()
  })

  it('renders cooking time', () => {
    render(<RecipeCardDisplay {...mockRecipe} />)
    expect(screen.getByTestId('cooking-time')).toHaveTextContent('30 mins')
  })

  it('renders difficulty level', () => {
    render(<RecipeCardDisplay {...mockRecipe} />)
    expect(screen.getByTestId('difficulty')).toHaveTextContent('Medium')
  })
})

// Validation utility tests
const validateRecipe = (recipe) => {
  const errors = {}
  if (!recipe.title || recipe.title.trim() === '') {
    errors.title = 'Title is required'
  }
  if (!recipe.ingredients || recipe.ingredients.length === 0) {
    errors.ingredients = 'At least one ingredient is required'
  }
  if (!recipe.instructions || recipe.instructions.trim() === '') {
    errors.instructions = 'Instructions are required'
  }
  return errors
}

describe('validateRecipe', () => {
  it('returns no errors for valid recipe', () => {
    const recipe = {
      title: 'Test Recipe',
      ingredients: ['ingredient 1', 'ingredient 2'],
      instructions: 'Step 1: Do something',
    }
    const errors = validateRecipe(recipe)
    expect(errors).toEqual({})
  })

  it('returns error for missing title', () => {
    const recipe = {
      title: '',
      ingredients: ['ingredient 1'],
      instructions: 'Step 1',
    }
    const errors = validateRecipe(recipe)
    expect(errors.title).toBe('Title is required')
  })

  it('returns error for missing ingredients', () => {
    const recipe = {
      title: 'Test Recipe',
      ingredients: [],
      instructions: 'Step 1',
    }
    const errors = validateRecipe(recipe)
    expect(errors.ingredients).toBe('At least one ingredient is required')
  })

  it('returns error for missing instructions', () => {
    const recipe = {
      title: 'Test Recipe',
      ingredients: ['ingredient 1'],
      instructions: '',
    }
    const errors = validateRecipe(recipe)
    expect(errors.instructions).toBe('Instructions are required')
  })

  it('returns multiple errors for invalid recipe', () => {
    const recipe = {
      title: '',
      ingredients: [],
      instructions: '',
    }
    const errors = validateRecipe(recipe)
    expect(Object.keys(errors).length).toBe(3)
  })
})
