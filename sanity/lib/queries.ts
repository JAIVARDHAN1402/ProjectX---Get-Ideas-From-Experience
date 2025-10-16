import { defineQuery } from "next-sanity";

export const PROJECT_QUERY = defineQuery(
    `*[
  _type == "project" &&
  defined(slug.current) &&
  (
    !defined($search) ||
    title match $search ||
    category match $search ||
    user->username match $search  // Use username instead of name
  )
] | order(views desc) {
  _id,
  title,
  slug,
  _createdAt,
  user -> {
    _id, 
    username,    // Your schema has username, not name
    email,
    image,       // Your schema uses 'image' not 'imageUrl'
    Bio          // Your schema uses 'Bio' not 'bio'
  },
  views,
  description,
  category,
  "imageUrl": image.asset->url
}`
);

export const PROJECT_BY_ID_QUERY = `*[_type == "project" && _id == $id][0]{
  _id,
  title,
  description,
  imageUrl,
  user->{
    _id,
    username,
    email,
    image,
    Bio
  },
  category,
  details,
  slug
}`;



export const user_BY_GITHUB_ID_QUERY = defineQuery(`*[_type == "user" && id == $id][0]{
  _id,
  id,
  username,     // Removed name (not in schema)
  email,
  image,        // Changed from imageUrl to image
  Bio           // Changed from bio to Bio
}`);

export const user_BY_GOOGLE_ID_QUERY = `*[_type == "user" && googleId == $sub][0]`;

export const user_BY_ID_QUERY = defineQuery(`*[_type == "user" && _id == $id][0]{
  _id,
  id,
  username,     // Removed name
  email,
  image,        // Changed from imageUrl to image
  Bio           // Changed from bio to Bio
}`);

export const PROJECT_BY_user_QUERY = defineQuery(
    `*[
  _type == "project" &&
  user._ref == $id] | order(_createdAt desc) {
  _id,
  title,
  slug,
  _createdAt,
  user -> {
    _id, 
    username,    // Changed from name to username
    image,       // Changed from imageUrl to image
    Bio          // Changed from bio to Bio
  },
  views,
  description,
  category,
  imageUrl
}`);
