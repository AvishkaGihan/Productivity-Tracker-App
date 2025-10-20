# 🚀 Quick Start Guide - Phase 1 Components

## Installation

```bash
cd frontend
npm install
```

## Basic Usage

### 1. Theme Setup (Already Done!)

The theme provider is already wrapped around your app in `App.tsx`. You can use it anywhere:

```tsx
import { useTheme } from "./theme";

function MyComponent() {
  const { theme, themeMode, toggleTheme } = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>Hello!</Text>
    </View>
  );
}
```

### 2. Using Components

```tsx
import {
  Button,
  Card,
  Input,
  Badge,
  Avatar,
  Chip,
  EmptyState,
  LoadingState,
  ErrorState
} from './components/common';

// Button Examples
<Button variant="primary" size="md" onPress={() => {}}>
  Click Me
</Button>

<Button variant="gradient" size="lg" loading={isLoading}>
  Submit
</Button>

// Card Example
<Card variant="elevated" onPress={() => {}}>
  <Text>Card Content</Text>
</Card>

// Input Example
<Input
  label="Email"
  placeholder="Enter your email"
  error={errors.email}
  leftIcon={<EmailIcon />}
/>

// Badge Examples
<Badge variant="success" size="sm">New</Badge>
<Badge variant="error" dot />

// Avatar Examples
<Avatar initials="JD" size="lg" />
<Avatar source={{ uri: imageUrl }} size="md" />

// Chip Examples
<Chip label="React Native" selected />
<Chip label="Remove" onDelete={() => {}} />

// Empty State
<EmptyState
  title="No tasks yet"
  description="Create your first task to get started"
  actionLabel="Add Task"
  onAction={() => {}}
  icon={<EmptyIcon />}
/>

// Loading State
<LoadingState variant="rectangular" height={100} />
<Skeleton loading={isLoading}>
  <Text>Content</Text>
</Skeleton>

// Error State
<ErrorState
  message="Failed to load data"
  onRetry={() => refetch()}
/>
```

### 3. Theme Switcher

Add to your settings screen:

```tsx
import { ThemeSwitcher } from "./components/ThemeSwitcher";

function SettingsScreen() {
  return (
    <View>
      <ThemeSwitcher />
    </View>
  );
}
```

### 4. Accessing Design Tokens

```tsx
import { useTheme } from "./theme";

function StyledComponent() {
  const { theme } = useTheme();

  const styles = {
    container: {
      padding: theme.spacing.md,
      borderRadius: theme.radius.lg,
      ...theme.shadows.md,
    },
    text: {
      ...theme.typography.styles.h2,
      color: theme.colors.primary,
    },
  };

  return <View style={styles.container}>...</View>;
}
```

## Common Patterns

### Form with Validation

```tsx
function LoginForm() {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  return (
    <Card variant="elevated">
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        placeholder="Enter your email"
        keyboardType="email-address"
      />

      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        placeholder="Enter your password"
        secureTextEntry
      />

      <Button
        variant="gradient"
        size="lg"
        fullWidth
        loading={loading}
        onPress={handleSubmit}
      >
        Login
      </Button>
    </Card>
  );
}
```

### List with Loading & Empty States

```tsx
function TaskList() {
  const { theme } = useTheme();
  const { tasks, loading, error } = useTasks();

  if (loading) {
    return (
      <View>
        <LoadingState height={80} style={{ marginBottom: 12 }} />
        <LoadingState height={80} style={{ marginBottom: 12 }} />
        <LoadingState height={80} />
      </View>
    );
  }

  if (error) {
    return (
      <ErrorState message="Failed to load tasks" onRetry={() => refetch()} />
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks yet"
        description="Create your first task to get started"
        actionLabel="Add Task"
        onAction={() => navigation.navigate("CreateTask")}
      />
    );
  }

  return (
    <FlatList
      data={tasks}
      renderItem={({ item }) => (
        <Card variant="elevated" onPress={() => openTask(item)}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Avatar initials={item.title[0]} size="sm" />
            <Text>{item.title}</Text>
            <Badge variant={item.priority}>{item.status}</Badge>
          </View>
        </Card>
      )}
    />
  );
}
```

### Header with Avatar

```tsx
function Header() {
  const { theme } = useTheme();
  const { user } = useAuth();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: theme.spacing.md,
        backgroundColor: theme.colors.surface,
      }}
    >
      <Avatar source={{ uri: user.avatar }} size="md" />
      <View style={{ marginLeft: theme.spacing.md }}>
        <Text
          style={{ ...theme.typography.styles.h6, color: theme.colors.text }}
        >
          {user.name}
        </Text>
        <Badge variant="success" size="sm">
          Online
        </Badge>
      </View>
    </View>
  );
}
```

## Tips & Tricks

1. **Spacing**: Always use `theme.spacing.*` instead of hardcoded values
2. **Colors**: Use semantic colors (`theme.colors.success`) over direct colors
3. **Typography**: Use `theme.typography.styles.*` for consistent text
4. **Shadows**: Apply `...theme.shadows.md` for elevation
5. **Border Radius**: Use `theme.radius.*` for consistent rounded corners
6. **Animations**: Use `theme.animations.duration.*` for consistent timing

## Next Steps

Now that you have the foundation:

1. Update existing screens to use new components
2. Apply consistent theming throughout
3. Add the ThemeSwitcher to settings
4. Test light/dark mode switching
5. Move to Phase 2: Enhanced Auth & Onboarding

Happy coding! 🎉
