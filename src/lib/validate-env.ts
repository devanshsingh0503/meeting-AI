// src/lib/validate-env.ts
// Run this in your deployment checks
import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url("Invalid DATABASE_URL"),
  
  // Auth
  BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
  
  // APIs
  OPENAI_API_KEY: z.string().startsWith("sk-", "Invalid OPENAI_API_KEY format"),
  
  // Stream.io
  NEXT_PUBLIC_STREAM_API_KEY: z.string(),
  STREAM_SECRET: z.string(),
  
  // Polar
  POLAR_ACCESS_TOKEN: z.string(),
  
  // App
  NEXT_PUBLIC_APP_URL: z.string().url("Invalid NEXT_PUBLIC_APP_URL"),
  
  // Inngest (optional)
  INNGEST_EVENT_KEY: z.string().optional(),
  INNGEST_SIGNING_KEY: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validate environment variables
 * Call this on app startup to fail fast if config is missing
 */
export function validateEnvironment(): EnvConfig {
  const result = envSchema.safeParse(process.env);
  
  if (!result.success) {
    const errors = result.error.flatten();
    console.error("❌ Environment validation failed:");
    
    Object.entries(errors.fieldErrors).forEach(([key, messages]) => {
      console.error(`  ${key}: ${messages?.join(", ")}`);
    });
    
    throw new Error("Invalid environment configuration. Check logs above.");
  }
  
  console.log("✅ Environment validation passed");
  return result.data;
}

export const env = validateEnvironment();
