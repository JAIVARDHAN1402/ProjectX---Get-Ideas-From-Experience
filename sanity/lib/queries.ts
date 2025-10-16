import { defineQuery } from "next-sanity";

export const PROJECT_QUERY = defineQuery(
    `*[
  _type == "project" &&
  defined(slug.current) &&
  (
    !defined($search) ||
    title match $search ||
    category match $search ||
    user->username match $search
  )
] | order(views desc) {
  _id,
  title,
  slug,
  _createdAt,
  user -> {
    _id, 
    username,
    email,
    image,
    Bio
  },
  views,
  description,
  category,
  imageUrl
}`);

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
  username,
  email,
  image,
  Bio
}`);

export const user_BY_GOOGLE_ID_QUERY = `*[_type == "user" && googleId == $sub][0]`;

export const user_BY_ID_QUERY = defineQuery(`*[_type == "user" && _id == $id][0]{
  _id,
  id,
  username,
  email,
  image,
  Bio
}`);

export const PROJECT_BY_user_QUERY = defineQuery(
    `*[
  _type == "project" &&
  user._ref == $id
] | order(_createdAt desc) {
  _id,
  title,
  slug,
  _createdAt,
  user -> {
    _id, 
    username,
    image,
    Bio
  },
  views,
  description,
  category,
  imageUrl
}`);