import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  saveMissionCompletion,
  getMissionCompletionsByUserId,
  getOrCreateProgressJournal,
  updateProgressJournal,
  getUserById,
  updateUser,
} from "../db";

const router = Router();

// POST /api/missions/complete - Save mission completion with answers
router.post("/complete", async (req: Request, res: Response) => {
  try {
    const {
      userId,
      missionId,
      missionTitle,
      studentAnswers,
      xpEarned,
      dnaCategory,
      ageAtCompletion,
      gradeLevel,
    } = req.body;

    // Validate required fields
    if (!userId || !missionId || !missionTitle || !studentAnswers || !xpEarned) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get current user data
    const userResult = await getUserById(userId);
    if (!userResult || userResult.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResult[0];
    const totalXPAfterCompletion = (user.totalXP || 0) + xpEarned;
    const levelAtCompletion = user.currentLevel || 1;

    // Save mission completion
    const completionId = uuidv4();
    await saveMissionCompletion({
      id: completionId,
      userId,
      missionId,
      missionTitle,
      studentAnswers,
      xpEarned,
      totalXPAfterCompletion,
      levelAtCompletion,
      dnaCategory,
      ageAtCompletion,
      gradeLevel,
    });

    // Update user XP and level
    await updateUser(userId, {
      totalXP: totalXPAfterCompletion,
      updatedAt: new Date(),
    });

    // Update progress journal
    const journal = await getOrCreateProgressJournal(userId);
    await updateProgressJournal(userId, {
      totalMissionsCompleted: (journal.totalMissionsCompleted || 0) + 1,
      totalXPEarned: totalXPAfterCompletion,
      currentLevel: levelAtCompletion,
      lastCompletionDate: new Date(),
      updatedAt: new Date(),
    });

    res.json({
      success: true,
      completionId,
      totalXPAfterCompletion,
      message: "Mission completed successfully",
    });
  } catch (error) {
    console.error("Error completing mission:", error);
    res.status(500).json({ error: "Failed to complete mission" });
  }
});

// GET /api/missions/completions/:userId - Get all mission completions for a user
router.get("/completions/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const completions = await getMissionCompletionsByUserId(userId);

    res.json({
      success: true,
      completions,
      count: completions.length,
    });
  } catch (error) {
    console.error("Error fetching mission completions:", error);
    res.status(500).json({ error: "Failed to fetch mission completions" });
  }
});

// GET /api/missions/progress/:userId - Get progress journal for a user
router.get("/progress/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const journal = await getOrCreateProgressJournal(userId);

    res.json({
      success: true,
      journal,
    });
  } catch (error) {
    console.error("Error fetching progress journal:", error);
    res.status(500).json({ error: "Failed to fetch progress journal" });
  }
});

export default router;
