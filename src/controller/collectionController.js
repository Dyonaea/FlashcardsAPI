

export const createCollectionSchema = async (req, res) => {
    const { title, visibility, description } = req.body;
  console.log(req.user);
  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.user.id))
      .limit(1);
    if (user.length === 0) {
      return res.status(401).send({ error: "Invalid user" });
    }
    const result = await db
      .insert(questionsTable)
      .values({
        title: title,
        visibility: visibility,
        description: description,
        creator: req.user.id,
      })
      .returning();
    console.log("Collection inserted successfully : ", result);
    res.status(201).send({
      response: "collection created with id " + result[0].id,
    });
  } catch (error) {
    res.status(500).send({
      error: "Failed to insert collection" + error,
    });
  }
};