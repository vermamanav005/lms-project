# Contributing to LMS Project

Thank you for your interest in contributing to our Learning Management System project!

## Branch Strategy

### Default Branch
- **`development`** is our default branch for active development
- **`main`** contains stable, production-ready code

### For Contributors

1. **Fork the repository**
2. **Clone your fork locally**
   ```bash
   git clone https://github.com/YOUR_USERNAME/lms-project.git
   cd lms-project
   ```

3. **Set up the development branch as your default working branch**
   ```bash
   git checkout development
   git pull origin development
   ```

4. **Create a feature branch from development**
   ```bash
   git checkout -b feature/your-feature-name
   ```

5. **Make your changes and commit them**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

6. **Push your feature branch**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - **Base branch**: `development`
   - **Compare branch**: `feature/your-feature-name`

### Important Notes

- **Always branch from `development`**, not `main`
- **All Pull Requests should target `development`**
- **Only merge to `main` after thorough testing and review**
- **Never commit directly to `main` or `development`**

### Commit Message Format

We follow conventional commit format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

### Getting Help

If you have any questions about the contribution process, please:
1. Check existing issues and pull requests
2. Create a new issue with the "question" label
3. Reach out to the maintainers

Thank you for contributing! 🚀 