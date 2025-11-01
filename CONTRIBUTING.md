# 🤝 Contributing to Love Ur Fragz

Thank you for your interest in contributing to Love Ur Fragz! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

## 🎯 Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please:

- Be respectful and considerate
- Use inclusive language
- Focus on constructive feedback
- Help others learn and grow
- Report any inappropriate behavior

## 🚀 Getting Started

### Prerequisites

- Read the [Setup Guide](docs/SETUP.md)
- Have a working development environment
- Fork the repository on GitHub

### Initial Setup

1. **Fork the Repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/love-ur-fragz.git
   cd love-ur-fragz
   ```

2. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/Izzudinalqassam/love-ur-fragz.git
   ```

3. **Install Dependencies**
   ```bash
   # Frontend
   cd frontend && npm install

   # Backend
   cd ../backend && go mod download
   ```

4. **Verify Setup**
   ```bash
   # Run the application
   cd ..
   node start-dev.js
   ```

## 🔄 Development Workflow

### 1. Create a Branch

```bash
# Sync with upstream
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-fix-name
```

### 2. Make Changes

- Follow the coding standards outlined below
- Make small, focused changes
- Test your changes thoroughly
- Update documentation as needed

### 3. Test Your Changes

```bash
# Frontend tests
cd frontend
npm test
npm run lint
npm run type-check

# Backend tests
cd ../backend
go test ./...
go fmt ./...
go vet ./...
```

### 4. Commit Your Changes

```bash
# Stage changes
git add .

# Commit with conventional commit format
git commit -m "feat: add new feature"
# or
git commit -m "fix: resolve API connection issue"
```

### 5. Push and Create Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create pull request on GitHub
```

## 📝 Coding Standards

### Frontend (React + TypeScript)

#### Component Structure
```typescript
// Component file structure
import React from 'react';
import { ComponentProps } from './types';

interface ComponentNameProps extends ComponentProps {
  // Props documentation
  /** Description of the prop */
  propName: string;
}

const ComponentName: React.FC<ComponentNameProps> = ({
  propName,
  ...otherProps
}) => {
  // Hooks first
  const [state, setState] = useState();

  // Event handlers
  const handleClick = () => {
    // Handle logic
  };

  // Render
  return (
    <div className="component-name">
      {/* JSX content */}
    </div>
  );
};

export default ComponentName;
```

#### TypeScript Guidelines
- Use strict TypeScript configuration
- Define interfaces for all props and data structures
- Avoid `any` types
- Use proper typing for API responses
- Export types that are used by other components

#### CSS/Tailwind Guidelines
- Use Tailwind utility classes
- Avoid custom CSS when possible
- Use responsive design prefixes
- Follow consistent spacing and color patterns
- Use semantic HTML elements

#### File Naming
- Use PascalCase for components: `PerfumeCard.tsx`
- Use camelCase for utilities: `apiService.ts`
- Use kebab-case for directories: `perfume-catalog/`

### Backend (Go)

#### Code Structure
```go
package handlers

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "github.com/your-org/love-ur-fragz/internal/models"
)

// GetPerfumes handles perfume listing
func GetPerfumes(c *gin.Context) {
    // Implementation
}

// CreatePerfume handles perfume creation
func CreatePerfume(c *gin.Context) {
    var req models.CreatePerfumeRequest

    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Business logic
    c.JSON(http.StatusCreated, gin.H{"data": perfume})
}
```

#### Go Guidelines
- Follow standard Go formatting (`go fmt`)
- Use meaningful variable and function names
- Handle errors explicitly
- Use dependency injection where appropriate
- Write godoc comments for exported functions

#### Error Handling
```go
// Always handle errors
result, err := someFunction()
if err != nil {
    // Log the error
    log.Printf("Error performing operation: %v", err)

    // Return appropriate response
    c.JSON(http.StatusInternalServerError, gin.H{
        "error": "Internal server error",
        "message": "Failed to complete operation",
    })
    return
}
```

## 🧪 Testing Guidelines

### Frontend Testing

#### Unit Tests
```typescript
// Component.test.tsx
import { render, screen } from '@testing-library/react';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName propName="test" />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('handles user interaction', () => {
    const handleClick = jest.fn();
    render(<ComponentName onClick={handleClick} />);

    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalled();
  });
});
```

#### Testing Best Practices
- Test user behavior, not implementation details
- Use meaningful test names
- Test both happy path and error cases
- Mock external dependencies
- Keep tests simple and focused

### Backend Testing

#### Unit Tests
```go
package handlers

import (
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "testing"

    "github.com/gin-gonic/gin"
    "github.com/stretchr/testify/assert"
)

func TestGetPerfumes(t *testing.T) {
    gin.SetMode(gin.TestMode)

    // Setup test router
    router := gin.Default()
    router.GET("/api/perfumes", GetPerfumes)

    // Create test request
    req, _ := http.NewRequest("GET", "/api/perfumes", nil)
    w := httptest.NewRecorder()

    // Perform request
    router.ServeHTTP(w, req)

    // Assertions
    assert.Equal(t, http.StatusOK, w.Code)

    var response map[string]interface{}
    err := json.Unmarshal(w.Body.Bytes(), &response)
    assert.NoError(t, err)
    assert.NotNil(t, response["data"])
}
```

## 📥 Pull Request Process

### Before Creating PR

1. **Ensure Code Quality**
   - All tests pass
   - Code follows style guidelines
   - No console errors or warnings
   - Documentation is updated

2. **Update Documentation**
   - README.md if needed
   - API documentation
   - Component documentation
   - Setup instructions

3. **Test Thoroughly**
   - Manual testing of the feature
   - Edge cases covered
   - Responsive design verified
   - Cross-browser compatibility

### Pull Request Template

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] Code follows project guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

### Review Process

1. **Automated Checks**
   - CI/CD pipeline runs
   - Tests must pass
   - Code quality checks

2. **Peer Review**
   - At least one maintainer review
   - Address all feedback
   - Update code as needed

3. **Merge**
   - Squash commits for clean history
   - Merge to main branch
   - Delete feature branch

## 🐛 Issue Reporting

### Bug Reports

Use this template for bug reports:

```markdown
## Bug Description
Clear and concise description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Screenshots
Add screenshots to help explain the problem.

## Environment
- OS: [e.g. Windows 10, macOS 12.0]
- Browser: [e.g. Chrome, Firefox]
- Version: [e.g. 1.0.0]

## Additional Context
Add any other context about the problem here.
```

### Feature Requests

```markdown
## Feature Description
Clear and concise description of the feature.

## Problem Statement
What problem does this feature solve?

## Proposed Solution
How you envision this feature working.

## Alternatives Considered
Other approaches you've considered.

## Additional Context
Any other context or screenshots about the feature.
```

## 🎖️ Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Special contributor badges
- Annual community highlights

## 📞 Getting Help

If you need help with contributing:

1. **Check existing issues** - Your question might be answered
2. **Read documentation** - Review setup and architecture docs
3. **Ask in discussions** - Start a GitHub discussion
4. **Contact maintainers** - Reach out directly

Thank you for contributing to Love Ur Fragz! 🎉