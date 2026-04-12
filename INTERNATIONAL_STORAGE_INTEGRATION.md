# International Storage Integration

This document explains how the frontend should send the `isInternational` flag when uploading or updating media-backed resources.

## Purpose

`isInternational` controls which object storage provider the backend uses:

- `true` = Bunny CDN / international storage
- `false` = Alibaba Cloud / domestic storage

The backend default is `true` when no flag is provided.

## Where to include it

Send `isInternational` with requests that create or update resources containing media:

- Category (`thumbnail`)
- Course (`thumbnail`)
- Practice (`thumbnail`, `items[].audioUrl`, `items[].imageUrl`)
- MockTest (`thumbnail`)
- MockTestSection (`questions[].audioUrl`, `questions[].images`)
- Lesson (`video.url`, `audio.url`)
- Agt assignment submission (`fileUrl`)

## Frontend behavior

### Default state

- Use a `shadcn` switch UI component for this option.
- Default switch state: `ON`
- Default value sent: `isInternational: true`

### Switch label example

- `Use international storage`
- `Upload to Bunny`
- `Domestic storage (Alibaba)` when toggled off

### Model integration

- The backend now persists `isInternational` in the corresponding DB models.
- Add the `isInternational` field in the frontend payload for media-backed resources whenever the switch is used.
- Keep the default switch state `true` so the frontend sends `isInternational: true` unless the user toggles it off.

## Payload examples

### Multipart upload form (file upload)

When sending files, include `isInternational` as a form field:

```js
const formData = new FormData();
formData.append('thumbnail', selectedFile);
formData.append('title', title);
formData.append('isInternational', isInternational ? 'true' : 'false');

axios.post('/api/courses', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
```

### JSON request body (create/update without file fields)

```json
{
  "title": "New course",
  "description": "Course description",
  "thumbnail": "https://...",
  "isInternational": true
}
```

## Backend usage

The backend middleware in `src/app/middleware/fileUpload.middleware.ts` chooses provider in this order:

1. `req.body.isInternational`
2. `(req as any).user?.isInternational`
3. `req.query.isInternational`
4. default `true`

So the frontend should pass the switch value explicitly when uploading or updating media-backed resources.

## Notes

- If the user changes the storage mode, include the new `isInternational` value in the update request.
- The backend now persists `isInternational` in relevant models, so the choice is stored with the resource.
- Use the switch only for upload/update operations.
