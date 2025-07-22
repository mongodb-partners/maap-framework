---
sidebar_position: 2
---

# Data Loaders

These data loaders facilitate the seamless integration of data into MongoDB's vector store, leveraging specific embedding models. They are designed to support the construction of gen AI application.


## Loaders with their usage
Currently the following data loaders can be used with the MAAP Framework; The usage defines what values are required by the `config.yaml` file to work with the loader. Multiple data sources can be used to ingest data by providing details of each.

### 1. Confluence Loader

Used to load and ingest content directly from Confluence spaces by specifying the necessary credentials and configuration.

**Usage:**
```js
ingest:
   - source: confluence
     space_names:
     confluence_base_url:
     confluence_username:
     confluence_token:
     chunk_size: 1000
     chunk_overlap: 100
```

---

### 2. Docx Loader

Utilized for extracting and processing content from Microsoft Word documents.

**Usage:**
```js
ingest:
   - source: docx
     source_path:
     chunk_size: 1000
     chunk_overlap: 100
```

---

### 3. PDF Loader

Designed for loading and extracting text from PDF files.

**Usage:**
```js
ingest:
   - source: pdf
     source_path:
     chunk_size: 1000
     chunk_overlap: 100
```

---

### 4. PPT Loader

Facilitates the extraction of content from PowerPoint presentations for further processing.

**Usage:**
```js
ingest:
   - source: ppt
     source_path:
     chunk_size: 1000
     chunk_overlap: 100
```

---

### 5. Sitemap Loader

Used for loading and processing sitemap files, typically for SEO purposes and navigation structure embedding.

**Usage:**
```js
ingest:
   - source: sitemap
     source_path:
     chunk_size: 1000
     chunk_overlap: 100

```

---

### 6. Web Loader

Extracts and processes content from web pages or HTML files.

**Usage:**
```js
ingest:
   - source: web
     source_path:
     chunk_size: 1000
     chunk_overlap: 100

```

---

### 7. Youtube Channel Loader

Ingests content from a specified YouTube channel by channel ID, suitable for processing large amounts of video data.

**Usage:**
```js
ingest:
   - source: youtube-channel
     channel_id:
     chunk_size: 1000
     chunk_overlap: 100
    
```

---

### 8. Youtube Loader

Extracts content from individual YouTube videos using their video ID or URL.

**Usage:**
```js
ingest:
   - source: youtube
     video_id_or_url: <video_id_or_url>
     chunk_size:   1000
     chunk_overlap: 100
    
```

---

### 9. Youtube Search Loader

Facilitates content extraction from the results of YouTube searches based on specified queries.

**Usage:**
```js
ingest:
   - source: youtube-search
     query: <query>
     chunk_size: 1000
     chunk_overlap: 100
    
```
---

### 10. Folder MIME type Loader

Loads and processes content from a specified folder on the local file system. Automatically detects and processes supported file types.
i.e. PDF, PPTX, DOCX, TXT

The file type filter is an optional field. If filter is not provided then the loader will process all the supported file type files in the folder.

**Usage:**
```js
ingest:
   - source: 'folder'
     source_path: '/path/to/folder'
     file_type: <'pdf'| 'txt' | 'pptx' | 'docx'> 
     chunk_size: 1000
     chunk_overlap: 100
    
```

---

### 11. LlamaIndex Loader

Loads and processes content from either a single file or from all files within a specified folder.
It uses LlamaParser for the loading, so it supports a wide array of document types.

The 'parsingInstructions' parameter allows you to give it natural-language instructions about what it's loading and how to load.
For instance, you can tell the loader to summarize or format the document(s) being processed.

The 'folderProcessing' parameter is used to tell the loader if we're processing a folder or not. It defaults to false.

**Usage:**
```js
ingest:
    - source: 'llama-index-loader'
      source_path: 'path/to/file' || 'path/to/folder'
      chunk_size: 2000
      chunk_overlap: 200
      parsingInstructions: ""
      folderProcessing: true || false
      language: <"af" | "az" | "bs" | "cs" | "cy" | "da" | "de" | "en" | "es" | "et" | "fr" | "ga" | "hr" | "hu" | "id" | "is" | "it" | "ku" | "la" | "lt" | "lv" | "mi" | "ms" | "mt" | "nl" | "no" | "oc" | "pi" | "pl" | "pt" | "ro" | "rs_latin" | "sk" | "sl" | "sq" | "sv" | "sw" | "tl" | "tr" | "uz" | "vi" | "ar" | "fa" | "ug" | "ur" | "bn" | "as" | "mni" | "ru" | "rs_cyrillic" | "be" | "bg" | "uk" | "mn" | "abq" | "ady" | "kbd" | "ava" | "dar" | "inh" | "che" | "lbe" | "lez" | "tab" | "tjk" | "hi" | "mr" | "ne" | "bh" | "mai" | "ang" | "bho" | "mah" | "sck" | "new" | "gom" | "sa" | "bgc" | "th" | "ch_sim" | "ch_tra" | "ja" | "ko" | "ta" | "te" | "kn">
      resultType: <"text" | "markdown"> 
```