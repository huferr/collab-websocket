import { Server } from "@hocuspocus/server";
import { TiptapTransformer } from "@hocuspocus/transformer";

import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";

// Extensions
import { Collaboration } from "@tiptap/extension-collaboration";
import { CollaborationCursor } from "@tiptap/extension-collaboration-cursor";
import { Document } from "@tiptap/extension-document";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Blockquote } from "@tiptap/extension-blockquote";
import { BulletList } from "@tiptap/extension-bullet-list";
import { Heading } from "@tiptap/extension-heading";
import { Text } from "@tiptap/extension-text";
import { ListItem } from "@tiptap/extension-list-item";
import { Paragraph } from "@tiptap/extension-paragraph";
import { HardBreak } from "@tiptap/extension-hard-break";
import { HorizontalRule } from "@tiptap/extension-horizontal-rule";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { Dropcursor } from "@tiptap/extension-dropcursor";
import { Gapcursor } from "@tiptap/extension-gapcursor";
import { History } from "@tiptap/extension-history";

// Marks
import Bold from "@tiptap/extension-bold";
import Strike from "@tiptap/extension-strike";
import Italic from "@tiptap/extension-italic";
import Code from "@tiptap/extension-code";

const documents = {};
const fieldName = "default";

const server = Server.configure({
  async onChange(data) {
    const save = () => {
      // Convert the y-doc to something you can actually use in your views.
      // In this example we use the TiptapTransformer to get JSON from the given
      // ydoc.

      const documentName = data?.documentName;

      const prosemirrorJSON = TiptapTransformer.fromYdoc(data.document);

      // Save your document. In a real-world app this could be a database query
      // a webhook or something else
      documents[documentName] = JSON.stringify(prosemirrorJSON);

      // Maybe you want to store the user who changed the document?
      // Guess what, you have access to your custom context from the
      // onConnect hook here. See authorization & authentication for more
      // details
      console.log(
        `Document ${data?.documentName} changed by ${data?.context?.user?.name}`
      );
    };

    save();
  },
  async onLoadDocument(data) {
    // The Tiptap collaboration extension uses shared types of a single y-doc
    // to store different fields in the same document.
    // The default field in Tiptap is simply called "default"

    const documentName = data?.documentName;

    // Check if the given field already exists in the given y-doc.
    // Important: Only import a document if it doesn't exist in the primary data storage!
    if (!data.document.isEmpty(fieldName)) {
      return;
    }

    if (!documents[documentName]) return;

    // Get the document from somewhere. In a real world application this would
    // probably be a database query or an API call
    const prosemirrorJSON = JSON.parse(documents[documentName] || "{}");

    // Convert the editor format to a y-doc. The TiptapTransformer requires you to pass the list
    // of extensions you use in the frontend to create a valid document
    return TiptapTransformer.toYdoc(prosemirrorJSON.default, fieldName, [
      Document,
      Text,
      Heading,
      Paragraph,
      CodeBlockLowlight,
      Collaboration,
      CollaborationCursor,
      Placeholder,
      Blockquote,
      BulletList,
      ListItem,
      HardBreak,
      HorizontalRule,
      OrderedList,
      Dropcursor,
      Gapcursor,
      History,
      Bold,
      Strike,
      Italic,
      Code,
    ]);
  },
});

server.listen();
