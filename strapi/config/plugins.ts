module.exports = ({ env }) => ({
    upload: {
        config: {
            provider: 'aws-s3',
            providerOptions: {
                baseUrl: env('CDN_URL', `https://${env('AWS_S3_BUCKET')}.s3.${env('AWS_REGION')}.amazonaws.com`),
                s3Options: {
                    accessKeyId: env('AWS_ACCESS_KEY_ID'),
                    secretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
                    region: env('AWS_REGION'),
                    params: {
                        ACL: null,
                        Bucket: env('AWS_S3_BUCKET'),
                    },
                },
            },
            // Enable thumbnail generation
            sizeLimit: 256 * 1024 * 1024, // 256mb
            formats: ['thumbnail', 'large', 'medium', 'small'],
            breakpoints: {
                xlarge: 1920,
                large: 1000,
                medium: 750,
                small: 500,
                xsmall: 64
            },
        },
    },
});