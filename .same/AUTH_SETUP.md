# Authentication Setup (Dev Mode)

## Current Status: BYPASSED FOR DEVELOPMENT ⚠️

Authentication is currently bypassed to allow rapid development. The system automatically logs in users without requiring credentials.

## Mock Users Available

You can switch between different user roles to test various permissions:

### 1. Admin User
- **Name:** Admin User
- **Email:** admin@lands.gov.pg
- **Role:** admin
- **Permissions:** Full system access (all features)

### 2. Land Officer
- **Name:** Land Officer
- **Email:** officer@lands.gov.pg
- **Role:** land_officer
- **Permissions:**
  - View applications
  - Create applications
  - Update applications
  - View leases

### 3. Applicant
- **Name:** John Applicant
- **Email:** john@example.com
- **Role:** applicant
- **Permissions:**
  - Create applications
  - View own applications only

### 4. Land Board Member
- **Name:** Board Member
- **Email:** board@lands.gov.pg
- **Role:** land_board_member
- **Permissions:**
  - View applications
  - Approve applications
  - View board meetings

## How to Switch Users

Click on your profile in the top right corner → "Switch User (Dev Mode)" → Select any user

## Implementation Details

### Files Created:
1. **`src/lib/auth-context.tsx`** - Authentication context and mock users
2. **`src/components/ProtectedFeature.tsx`** - Component for role-based access control

### Key Functions:
- `useAuth()` - Hook to access current user and auth functions
- `hasPermission(user, permission)` - Check if user has specific permission
- `<ProtectedFeature>` - Component to wrap features that require specific roles/permissions

## Example Usage

```tsx
import { useAuth } from '@/lib/auth-context'
import { ProtectedFeature } from '@/components/ProtectedFeature'

function MyComponent() {
  const { user } = useAuth()

  return (
    <div>
      <p>Hello, {user.name}!</p>

      {/* Only show to admins */}
      <ProtectedFeature roles={['admin']}>
        <button>Admin Only Button</button>
      </ProtectedFeature>

      {/* Check specific permission */}
      <ProtectedFeature permission="approve_applications">
        <button>Approve</button>
      </ProtectedFeature>
    </div>
  )
}
```

## Next Steps: Implementing Real RBAC

When ready to implement real authentication:

1. **Set up Supabase Auth**
   ```bash
   # User table with roles
   CREATE TABLE user_roles (
     user_id UUID REFERENCES auth.users,
     role TEXT NOT NULL,
     department TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

2. **Replace Mock Context**
   - Update `auth-context.tsx` to use Supabase auth
   - Keep the same interface to minimize code changes

3. **Add Login Page**
   - Create `/login` page with Supabase authentication
   - Implement proper session management

4. **Define Permissions Matrix**
   - Create database table for permissions
   - Implement fine-grained RBAC

5. **Add Protected Routes**
   - Middleware to check authentication
   - Redirect unauthenticated users to login

## Security Note

⚠️ **IMPORTANT:** This setup is for DEVELOPMENT ONLY. Never deploy to production with authentication bypassed!
