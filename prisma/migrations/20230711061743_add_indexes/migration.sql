-- CreateIndex
CREATE INDEX "Favorite_recipeId_userId_idx" ON "Favorite"("recipeId", "userId");

-- CreateIndex
CREATE INDEX "File_id_idx" ON "File"("id");

-- CreateIndex
CREATE INDEX "Nutrients_recipeId_idx" ON "Nutrients"("recipeId");

-- CreateIndex
CREATE INDEX "Recipe_id_idx" ON "Recipe"("id");

-- CreateIndex
CREATE INDEX "Recipe_title_description_idx" ON "Recipe"("title", "description");

-- CreateIndex
CREATE INDEX "RecipeCategory_recipeId_idx" ON "RecipeCategory"("recipeId");

-- CreateIndex
CREATE INDEX "Review_id_idx" ON "Review"("id");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");
