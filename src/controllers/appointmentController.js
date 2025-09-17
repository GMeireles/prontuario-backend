// controllers/appointmentController.js
import db from "../models/index.js";
import { Op } from "sequelize";

const { Appointment, Patient, User } = db;

export const listAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { tenant_id: req.user.tenant_id },
      include: [{ model: Patient, as: "patient" }],
      order: [["date_time", "ASC"]],
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create({
      ...req.body,
      tenant_id: req.user.tenant_id, // 👈 aqui também estava req.tenant_id errado
      professional_id: req.user.id,
    });
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      where: { id: req.params.id, tenant_id: req.user.tenant_id },
    });
    if (!appointment)
      return res.status(404).json({ error: "Consulta não encontrada" });

    await appointment.destroy();
    res.json({ message: "Consulta removida com sucesso" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findOne({
      where: { id, tenant_id: req.user.tenant_id },
    });
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Consulta não encontrada" });
    }

    await appointment.update(req.body);
    res.json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

export const cancelAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const appointment = await Appointment.findOne({
      where: { id, tenant_id: req.user.tenant_id },
    });
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Consulta não encontrada" });
    }

    await appointment.update({
      status: "cancelled",
      cancellation_reason: reason,
    });
    res.json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

export const confirmAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findOne({
      where: { id, tenant_id: req.user.tenant_id },
    });
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Consulta não encontrada" });
    }

    await appointment.update({ status: "confirmed" });
    res.json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

export const completeAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findOne({
      where: { id, tenant_id: req.user.tenant_id },
    });
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Consulta não encontrada" });
    }

    await appointment.update({ status: "completed" });
    res.json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

export const listTodayAppointments = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const appointments = await Appointment.findAll({
      where: {
        tenant_id: req.user.tenant_id,
        date_time: { [Op.between]: [start, end] },
      },
      include: [
        { model: Patient, as: "patient", attributes: ["id", "name"] },
        { model: User, as: "professional", attributes: ["id", "name"] },
      ],
      order: [["date_time", "ASC"]],
    });

    res.json(appointments);
  } catch (err) {
    console.error("Erro em listTodayAppointments:", err);
    res.status(500).json({ error: "Erro ao carregar consultas de hoje" });
  }
};
