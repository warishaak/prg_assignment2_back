# Backend

A Supabase Edge Functions API for managing coffee drinks and photos, providing a complete backend solution for a coffee tracking application.

## Overview

This backend service provides REST API endpoints for:
- Managing coffee drink entries (CRUD operations)
- Handling coffee photos (upload, retrieve, delete)

The API is built using Supabase Edge Functions and leverages Supabase Storage for photo management.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [curl](https://curl.se/) for testing functions locally

## Getting Started

Before starting with this project please set up an account with [Supabase](https://supabase.com/)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Install Dependencies

`npm install`

**Very important, if you are working on your project in cloud spaces prefix all your supabase commands with `npx`**

### 3. Authenticate with Supabase
The first step is to authenticate with Supabase:

```bash
npx supabase login
```

This will open a browser window where you can authenticate with Supabase and generate an access token.

### 4. Link

Once authenticated, link your local project to your Supabase project:

```bash
npx supabase link --project-ref your_project_id
```

**Deploying your Edge functions**

```bash
npx supabase functions deploy
```
This will deploy both the coffee_drinks and photos functions to your Supabase project.

### 5. Testing

The project includes comprehensive test coverage for both Edge Functions:

```bash
cd supabase/functions/coffee_drinks
deno test --allow-env --allow-net

cd ../photos
deno test --allow-env --allow-net
```
**Test Coverage**

The test suite covers:

- ✅ Retrieving all coffee drinks
- ✅ Creating new coffee drinks
- ✅ Updating existing coffee drinks
- ✅ Deleting coffee drinks
- ✅ Retrieving all photos
- ✅ Uploading photos (with format validation)
- ✅ Deleting photos
- ✅ Error handling for invalid methods

### 4. Database Schema

The application uses the following Supabase table structure:

**coffee_drinks**

- id: UUID (primary key)
- name: String (coffee drink name)
- coffee_shop: String (shop where the coffee was purchased)
- rating: Number (1-5 rating)
- created_at: Timestamp (auto-generated)

**Storage Structure**

Photos are stored in the coffee-photos bucket within Supabase Storage.

