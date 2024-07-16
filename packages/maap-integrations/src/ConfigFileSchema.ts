import { z } from "zod";

const VectorStoreSchema = z.object({
  connectionString: z.string(),
  dbName: z.string(),
  collectionName: z.string(),
  embeddingKey: z.string(),
  textKey: z.string(),
  numDimensions: z.number().optional(),
  similarityFunction: z.string(),
  minScore: z.number(),
  vectorSearchIndexName: z.string(),
  numCandidates: z.number().optional(),
});

const LlmsSchema = z.object({
  class_name: z.string(),
  model_name: z.string().optional(),
});

const EmbeddingSchema = z.object({
  class_name: z.string(),
  model_name: z.string(),
  deployment_name: z.string(),
  api_version: z.string().optional(),
  azure_openai_api_instance_name: z.string().optional(),
  dimension: z.number().optional(),
});

const WebLoaderSchema = z.object({
  source: z.literal("web"),
  source_path: z.string(),
  chunk_size: z.number(),
  chunk_overlap: z.number(),
});

const PdfLoaderSchema = z.object({
  source: z.literal("pdf"),
  source_path: z.string(),
  chunk_size: z.number(),
  chunk_overlap: z.number(),
});

const SitemapLoaderSchema = z.object({
  source: z.literal("sitemap"),
  source_path: z.string(),
  chunk_size: z.number(),
  chunk_overlap: z.number(),
});

const DocxLoaderSchema = z.object({
  source: z.literal("docx"),
  source_path: z.string(),
  chunk_size: z.number(),
  chunk_overlap: z.number(),
});

const ConfluenceLoaderSchema = z.object({
  source: z.literal("confluence"),
  space_names: z.array(z.string()),
  confluence_base_url: z.string(),
  confluence_username: z.string(),
  confluence_token: z.string(),
  chunk_size: z.number(),
  chunk_overlap: z.number(),
});

const YoutubeSearchLoaderSchema = z.object({
  source: z.literal("youtube-search"),
  query: z.string(),
  chunk_size: z.number(),
  chunk_overlap: z.number(),
});

const YoutubeLoaderSchema = z.object({
  source: z.literal("youtube"),
  video_id_or_url: z.string(),
  chunk_size: z.number(),
  chunk_overlap: z.number(),
});

const YoutubeChannelLoaderSchema = z.object({
  source: z.literal("youtube-channel"),
  channel_id: z.string(),
  chunk_size: z.number(),
  chunk_overlap: z.number(),
});

const PptLoaderSchema = z.object({
  source: z.literal("ppt"),
  source_path: z.string(),
  chunk_size: z.number(),
  chunk_overlap: z.number(),
});

// Use discriminated union to define the Ingest schema
const IngestSchema = z.discriminatedUnion("source", [
  WebLoaderSchema,
  PdfLoaderSchema,
  SitemapLoaderSchema,
  DocxLoaderSchema,
  ConfluenceLoaderSchema,
  YoutubeSearchLoaderSchema,
  YoutubeLoaderSchema,
  YoutubeChannelLoaderSchema,
  PptLoaderSchema,
]);

const StreamOptionsSchema = z.object({
  stream: z.boolean().optional(),
});

export const ConfigFileSchema = z.object({
  vector_store: VectorStoreSchema,
  llms: LlmsSchema,
  embedding: EmbeddingSchema,
  ingest: z.array(IngestSchema),
  stream_options: StreamOptionsSchema.optional(),
});
export type ConfigFileSchema = z.infer<typeof ConfigFileSchema>;
