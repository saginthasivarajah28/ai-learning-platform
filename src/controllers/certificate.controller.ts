import { Response } from "express";
import { AuthRequest } from "../types/auth.types";

import {
  generateCertificate,
  getMyCertificates,
  getCertificateById,
} from "../services/certificate.service";

export const generate = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const courseId = Number(req.params.courseId);

    if (isNaN(courseId)) {
      return res.status(400).json({
        message: "Invalid course ID",
      });
    }

    const certificate =
      await generateCertificate(
        req.user.id,
        courseId
      );

    res.status(201).json({
      message: "Certificate generated successfully",
      certificate,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getMine = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const certificates =
      await getMyCertificates(req.user.id);

    res.status(200).json({
      message: "Certificates fetched successfully",
      certificates,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getOne = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const certificateId = Number(req.params.id);

    if (isNaN(certificateId)) {
      return res.status(400).json({
        message: "Invalid certificate ID",
      });
    }

    const certificate =
      await getCertificateById(
        certificateId,
        req.user.id
      );

    res.status(200).json({
      message: "Certificate fetched successfully",
      certificate,
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
    });
  }
};