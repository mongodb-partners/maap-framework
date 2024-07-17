---
sidebar_position: 2
---

# Data Loaders

These data loaders facilitate the seamless integration of data into MongoDB's vector store, leveraging specific embedding models. They are designed to support the construction of Retrieval-Augmented Generation (RAG) chatbot applications


## Loaders with their usage
Currently the following data loaders can be used with the MAAP Framework; The usage defines what values are required by the `config.yaml` file to work with the loader.

### 1. Confluence Loader

Used to load and ingest content directly from Confluence spaces by specifying the necessary credentials and configuration.

**Usage:**
```js
ingest:
  source: confluence
  space_names:
  confluence_base_url:
  confluence_username:
  confluence_token:
  chunk_size:
  chunk_overlap:
```

---

### 2. Docx Loader

Utilized for extracting and processing content from Microsoft Word documents.

**Usage:**
```js
ingest:
  source: docx
  source_path:
  chunk_size:
  chunk_overlap:
```

---

### 3. PDF Loader

Designed for loading and extracting text from PDF files.

**Usage:**
```js
ingest:
  source: pdf
  source_path:
  chunk_size:
  chunk_overlap:
```

---

### 4. PPT Loader

Facilitates the extraction of content from PowerPoint presentations for further processing.

**Usage:**
```js
ingest:
  source: ppt
  source_path:
  chunk_size:
  chunk_overlap:
```

---

### 5. Sitemap Loader

Used for loading and processing sitemap files, typically for SEO purposes and navigation structure embedding.

**Usage:**
```js
ingest:
  source: sitemap
  source_path:
  chunk_size:
  chunk_overlap:
```

---

### 6. Web Loader

Extracts and processes content from web pages or HTML files.

**Usage:**
```js
ingest:
  source: web
  source_path:
  chunk_size:
  chunk_overlap:
```

---

### 7. Youtube Channel Loader

Ingests content from a specified YouTube channel by channel ID, suitable for processing large amounts of video data.

**Usage:**
```js
ingest:
  source: youtube-channel
  channel_id:
  chunk_size:
  chunk_overlap:
```

---

### 8. Youtube Loader

Extracts content from individual YouTube videos using their video ID or URL.

**Usage:**
```js
ingest:
  source: youtube
  video_id_or_url:
  chunk_size:
  chunk_overlap:
```

---

### 9. Youtube Search Loader

Facilitates content extraction from the results of YouTube searches based on specified queries.

**Usage:**
```js
ingest:
  source: youtube-search
  query:
  chunk_size:
  chunk_overlap:
```