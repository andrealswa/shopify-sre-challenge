# Migration `20200828184137-added-private-field-to-images`

This migration has been generated by andrealswa at 8/28/2020, 2:41:37 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Image" ADD COLUMN "privateImg" boolean   NOT NULL DEFAULT true
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200828180756-added-image-table..20200828184137-added-private-field-to-images
--- datamodel.dml
+++ datamodel.dml
@@ -3,9 +3,9 @@
 }
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 model User {
   email String @unique
@@ -24,7 +24,8 @@
   author    User?   @relation(fields: [authorId], references: [id])
 }
 model Image {
-  id  Int    @default(autoincrement()) @id
-  url String
+  id         Int     @default(autoincrement()) @id
+  url        String
+  privateImg Boolean @default(true)
 }
```


