import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";

type AuthInstance = Awaited<ReturnType<typeof initializeAuth>>;

let authPromise: Promise<AuthInstance> | undefined;

function getRequiredEnvironmentVariable(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getOptionalProviderCredentials(
  clientIdVariable: string,
  clientSecretVariable: string,
): { clientId: string; clientSecret: string } | undefined {
  const clientId = process.env[clientIdVariable];
  const clientSecret = process.env[clientSecretVariable];

  if (!clientId && !clientSecret) {
    return undefined;
  }
  if (!clientId || !clientSecret) {
    throw new Error(
      `Set both ${clientIdVariable} and ${clientSecretVariable} to enable this sign-in provider.`,
    );
  }

  return { clientId, clientSecret };
}

export function getAuth(): Promise<AuthInstance> {
  if (!authPromise) {
    authPromise = initializeAuth().catch((error: unknown) => {
      authPromise = undefined;
      throw error;
    });
  }

  return authPromise;
}

async function initializeAuth() {
  const mongoUri = getRequiredEnvironmentVariable("MONGODB_URI");
  const secret = getRequiredEnvironmentVariable("BETTER_AUTH_SECRET");
  const baseURL = getRequiredEnvironmentVariable("BETTER_AUTH_URL");
  if (secret.length < 32) {
    throw new Error("BETTER_AUTH_SECRET must be at least 32 characters long.");
  }
  if (mongoUri.includes("<db_password>")) {
    throw new Error("Replace <db_password> in MONGODB_URI with your Atlas password.");
  }

  const googleCredentials = getOptionalProviderCredentials(
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
  );
  const githubCredentials = getOptionalProviderCredentials(
    "GITHUB_CLIENT_ID",
    "GITHUB_CLIENT_SECRET",
  );

  const client = new MongoClient(mongoUri);
  await client.connect();

  return betterAuth({
    appName: "Bazar Dor",
    baseURL,
    secret,
    database: mongodbAdapter(client.db("BazarDorDatabase"), { client }),
    account: {
      accountLinking: {
        trustedProviders: ["google", "github"],
      },
    },
    emailAndPassword: {
      enabled: true,
      autoSignIn: false,
    },
    onAPIError: {
      errorURL: `${baseURL}/auth-error`,
    },
    trustedOrigins: [baseURL],
    socialProviders: {
      ...(googleCredentials
        ? {
            google: googleCredentials,
          }
        : {}),
      ...(githubCredentials
        ? {
            github: githubCredentials,
          }
        : {}),
    },
  });
}
