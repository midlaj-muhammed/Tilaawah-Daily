# Contributing to Tilaawah Daily

Thank you for your interest in contributing to Tilaawah Daily! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Bugs

- Use the [GitHub Issues](https://github.com/yourusername/tilaawah-daily/issues) page
- Provide a clear and descriptive title
- Include detailed steps to reproduce the issue
- Add screenshots if applicable
- Specify your device, OS version, and app version

### Suggesting Features

- Open an issue with the "enhancement" label
- Provide a clear description of the feature
- Explain the use case and why it would be valuable
- Consider if it aligns with the app's mission

### Code Contributions

1. **Fork the repository**
   - Click the "Fork" button on GitHub
   - Clone your fork locally

2. **Set up your development environment**
   ```bash
   git clone https://github.com/yourusername/tilaawah-daily.git
   cd tilaawah-daily
   npm install
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes**
   - Follow the coding standards below
   - Test your changes thoroughly
   - Update documentation if needed

5. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Use a descriptive title
   - Reference any related issues
   - Provide a clear description of changes

## 📝 Coding Standards

### Code Style

- Use TypeScript for all new code
- Follow React Native and Expo best practices
- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic

### Component Structure

```typescript
// Example component structure
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ComponentProps {
  // Define props here
}

const ComponentName: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component logic here
  
  return (
    <View style={styles.container}>
      <Text>Component content</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Styles here
  },
});

export default ComponentName;
```

### State Management

- Use Zustand for global state
- Keep state minimal and focused
- Use TypeScript interfaces for state types

### File Naming

- Use kebab-case for file names: `component-name.tsx`
- Use PascalCase for component names: `ComponentName`
- Keep related files in the same directory

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Write tests for new features and bug fixes
- Test both happy path and edge cases
- Use descriptive test names
- Keep tests simple and focused

## 📋 Pull Request Guidelines

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Commit messages are clear and follow [Conventional Commits](https://conventionalcommits.org/)
- [ ] No sensitive data is included

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Manual testing completed
- [ ] Screenshots attached (if UI changes)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

## 🎯 Development Focus Areas

### High Priority

- Improving user experience
- Performance optimization
- Bug fixes
- Accessibility improvements

### Medium Priority

- New features aligned with app mission
- Code refactoring
- Documentation improvements
- Test coverage

### Areas of Expertise Needed

- React Native development
- TypeScript
- Firebase integration
- UI/UX design
- Mobile testing
- Arabic language support

## 📞 Getting Help

- Join our [Discord community](https://discord.gg/your-invite)
- Ask questions in GitHub Discussions
- Review existing issues and PRs for context

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- App credits (for significant contributions)

## 📜 Code of Conduct

### Our Pledge

We are committed to making participation in this project a harassment-free experience for everyone, regardless of:

- Age, body size, disability, ethnicity, gender identity and expression
- Level of experience, education, socioeconomic status, nationality
- Personal appearance, race, religion, or sexual identity

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Harassment, trolling, or derogatory comments
- Personal attacks or political attacks
- Public or private harassment
- Publishing private information without explicit permission
- Any other conduct which could reasonably be considered inappropriate

### Enforcement

Project maintainers have the right and responsibility to remove, edit, or reject comments, commits, code, wiki edits, issues, and other contributions that are not aligned with this Code of Conduct.

## 📚 Resources

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

---

Thank you for contributing to Tilaawah Daily! Your efforts help make daily Quran recitation accessible to more people. 🙏
