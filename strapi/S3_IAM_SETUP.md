# S3 IAM Setup for Strapi

## Current Configuration Status

✅ **S3 Provider Package**: Installed `@strapi/provider-upload-aws-s3`
✅ **Plugin Configuration**: `config/plugins.ts` is properly configured
✅ **Middleware Security**: CSP headers allow your S3 bucket
✅ **Environment Variables**: S3 credentials are set in `.env`

## Required IAM Permissions

Your IAM user needs the following permissions for the bucket `chs-warrior-country`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::chs-warrior-country",
        "arn:aws:s3:::chs-warrior-country/*"
      ]
    }
  ]
}
```

## How to Verify/Create IAM User

### Option 1: Verify Existing IAM User (AKIA475QIQW7LF7NBTI6)

1. Log into AWS Console
2. Go to **IAM** → **Users**
3. Find the user with access key `AKIA475QIQW7LF7NBTI6`
4. Check **Permissions** tab
5. Ensure the policy above is attached (or similar S3 permissions)

### Option 2: Create New IAM User

1. Go to **IAM** → **Users** → **Create user**
2. Name: `strapi-s3-upload` (or your preferred name)
3. Select **Programmatic access**
4. Attach permissions:
   - Click **Attach policies directly**
   - Click **Create policy** → **JSON**
   - Paste the policy above
   - Name it: `StrapiS3UploadPolicy`
5. Create user and save the credentials
6. Update `.env` with new credentials

## Testing S3 Access

You can test your S3 credentials with this AWS CLI command:

```bash
# List bucket contents
aws s3 ls s3://chs-warrior-country --region us-west-1

# Test upload
echo "test" > test.txt
aws s3 cp test.txt s3://chs-warrior-country/test.txt --region us-west-1
aws s3 rm s3://chs-warrior-country/test.txt --region us-west-1
rm test.txt
```

Or use this Node.js test script (save as `test-s3.js`):

```javascript
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function testS3() {
  try {
    // Test upload
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: "test-strapi.txt",
        Body: "Hello from Strapi!",
      })
    );
    console.log("✅ Upload successful");

    // Test read
    await s3Client.send(
      new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: "test-strapi.txt",
      })
    );
    console.log("✅ Read successful");

    console.log("\n✅ S3 access is working correctly!");
  } catch (error) {
    console.error("❌ S3 access failed:", error.message);
  }
}

testS3();
```

Run with: `node test-s3.js`

## Bucket Configuration

Make sure your S3 bucket has:

1. **CORS Configuration** (if accessing from frontend):

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```

2. **Public Access Settings**:

   - Block all public access: OFF (if you want public read)
   - Or keep it ON and use CloudFront/signed URLs

3. **Bucket Policy** (for public read access):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::chs-warrior-country/*"
    }
  ]
}
```

## Next Steps

1. Verify IAM permissions using one of the options above
2. Test S3 access using the test script
3. Start Strapi: `npm run dev`
4. Try uploading a file through the Strapi admin panel
5. Check if files appear in your S3 bucket

## Troubleshooting

- **403 Forbidden**: IAM user lacks permissions
- **Invalid credentials**: Check access key and secret in `.env`
- **Bucket not found**: Verify bucket name and region
- **CORS errors**: Add CORS configuration to bucket
