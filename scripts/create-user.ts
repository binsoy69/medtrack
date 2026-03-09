import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { createAdminClient } from "../src/lib/supabase/admin";

async function main() {
  const args = process.argv.slice(2);

  let username = "";
  let password = "";
  let timezone = "";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--username" && args[i + 1]) {
      username = args[i + 1];
      i++;
    } else if (args[i] === "--password" && args[i + 1]) {
      password = args[i + 1];
      i++;
    } else if (args[i] === "--timezone" && args[i + 1]) {
      timezone = args[i + 1];
      i++;
    }
  }

  if (!username || !password || !timezone) {
    console.error("Error: Missing required arguments.");
    console.error(
      'Usage: npm run create-user -- --username <username> --password <password> --timezone "<timezone>"',
    );
    process.exit(1);
  }

  const email = `${username}@medtrack.local`;
  const supabaseAdmin = createAdminClient();

  try {
    // 1. Create the user in Supabase Auth
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          username,
          timezone,
          notification_email: null,
        },
      });

    if (authError) {
      console.error("Error creating user in Supabase Auth:", authError.message);
      process.exit(1);
    }

    const newUser = authData.user;

    // 2. Create the default profile in the profiles table
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        user_id: newUser.id,
        name: username,
      });

    if (profileError) {
      console.error(
        "User created, but failed to create default profile:",
        profileError.message,
      );
      process.exit(1);
    }

    console.log(
      `User '${username}' created successfully with default profile.`,
    );
    process.exit(0);
  } catch (err) {
    console.error("Unexpected error:", err);
    process.exit(1);
  }
}

main();
