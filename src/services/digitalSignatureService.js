import crypto from 'crypto';
import db from '../models/index.js';
import { anamneseAnswerService } from './anamneseAnswerService.js';

const { DigitalSignature } = db;

function buildAnamneseCanonicalSnapshot(anamnese) {
  if (!anamnese.template_id) {
    return JSON.stringify({
      type: 'legacy',
      main_complaint: anamnese.main_complaint || '',
      medical_history: anamnese.medical_history || '',
      family_history: anamnese.family_history || '',
      lifestyle: anamnese.lifestyle || '',
      allergies: anamnese.allergies || ''
    });
  }

  const answers = (anamnese.answers || [])
    .slice()
    .sort((a, b) => a.field_key.localeCompare(b.field_key))
    .map((a) => ({
      key: a.field_key,
      value: a.value_json !== null && a.value_json !== undefined ? a.value_json : (a.value_text || '')
    }));

  return JSON.stringify({
    type: 'flexible',
    template_id: anamnese.template_id,
    answers
  });
}

function hashContent(content) {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

export const digitalSignatureService = {
  buildAnamneseCanonicalSnapshot,
  hashContent,

  async createTypedSignature({
    tenantId,
    patientId,
    userId,
    entityType,
    entityId,
    signerName,
    signerDocument,
    signatureData,
    documentContent,
    ipAddress,
    userAgent
  }) {
    const documentHash = hashContent(documentContent);
    const now = new Date();

    return DigitalSignature.create({
      tenant_id: tenantId,
      patient_id: patientId,
      user_id: userId,
      entity_type: entityType,
      entity_id: entityId,
      signature_type: 'typed',
      signature_data: JSON.stringify(signatureData),
      signer_name: signerName,
      signer_document: signerDocument || null,
      ip_address: ipAddress || null,
      user_agent: userAgent || null,
      document_hash: documentHash,
      signed_at: now
    });
  },

  async listByPatient(patientId, tenantId) {
    return DigitalSignature.findAll({
      where: { patient_id: patientId, tenant_id: tenantId },
      order: [['signed_at', 'DESC']]
    });
  },

  async getById(id, tenantId) {
    return DigitalSignature.findOne({
      where: { id, tenant_id: tenantId }
    });
  },

  formatSignature(sig) {
    if (!sig) return null;
    const plain = sig.toJSON ? sig.toJSON() : sig;
    let signatureData = plain.signature_data;
    try {
      signatureData = JSON.parse(plain.signature_data);
    } catch {
      /* keep string */
    }
    return { ...plain, signature_data: signatureData };
  }
};

export function buildAnamneseSnapshotFromRecord(anamnese) {
  return buildAnamneseCanonicalSnapshot(anamnese);
}
