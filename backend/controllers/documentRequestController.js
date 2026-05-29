const DocumentRequest = require('../models/DocumentRequest');
const DocumentRequestArchive = require('../models/DocumentRequestArchive');
const Notification = require('../models/Notification');

const createDocumentRequest = async (req, res) => {
  try {
    const { docType, purpose, residentId, supportingInfo } = req.body;
    
    const documentRequest = new DocumentRequest({
      residentId: residentId || req.user.id,
      docType,
      purpose,
      supportingInfo
    });
    
    await documentRequest.save();
    
    res.status(201).json(documentRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyDocumentRequests = async (req, res) => {
  try {
    const requests = await DocumentRequest.find({ residentId: req.user.id, isArchived: false });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllDocumentRequests = async (req, res) => {
  try {
    const { status } = req.query
    let query = { isArchived: false }
    if (status) query.status = status
    const requests = await DocumentRequest.find(query).populate('residentId', 'fullName')
    res.json(requests)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
};

const getDocumentRequest = async (req, res) => {
  try {
    const request = await DocumentRequest.findById(req.params.id).populate('residentId', 'fullName email');
    
    if (!request) {
      return res.status(404).json({ message: 'Document request not found' });
    }
    
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateDocumentRequest = async (req, res) => {
  try {
    const oldRequest = await DocumentRequest.findById(req.params.id);
    if (!oldRequest) {
      return res.status(404).json({ message: 'Document request not found' });
    }
    
    const updateData = { ...req.body };
    if (updateData.status && updateData.status !== oldRequest.status) {
      updateData.timeline = [...(oldRequest.timeline || []), {
        status: updateData.status,
        note: updateData.adminNote || '',
        updatedBy: req.user.id
      }];
    }
    
    const request = await DocumentRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    const notification = new Notification({
      userId: request.residentId,
      message: `Your ${request.docType} request is now ${request.status}`,
      type: 'document',
      link: `/document-requests/${request._id}`
    });
    await notification.save();
    
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const archiveDocumentRequest = async (req, res) => {
  try {
    const request = await DocumentRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Document request not found' });
    }
    
    const archive = new DocumentRequestArchive({
      archivedFrom: request._id,
      residentId: request.residentId,
      docType: request.docType,
      purpose: request.purpose,
      supportingInfo: request.supportingInfo,
      status: request.status,
      adminNote: request.adminNote,
      archivedBy: req.user.id
    });
    
    await archive.save();
    await DocumentRequest.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Document request archived successfully', archive });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getArchivedDocumentRequests = async (req, res) => {
  try {
    const requests = await DocumentRequestArchive.find().populate('residentId', 'fullName');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const restoreDocumentRequest = async (req, res) => {
  try {
    const archive = await DocumentRequestArchive.findById(req.params.id);
    
    if (!archive) {
      return res.status(404).json({ message: 'Archived document request not found' });
    }
    
    const request = new DocumentRequest({
      residentId: archive.residentId,
      docType: archive.docType,
      purpose: archive.purpose,
      supportingInfo: archive.supportingInfo,
      status: archive.status
    });
    
    await request.save();
    await DocumentRequestArchive.findByIdAndDelete(req.params.id);
    
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createDocumentRequest,
  getMyDocumentRequests,
  getAllDocumentRequests,
  getDocumentRequest,
  updateDocumentRequest,
  archiveDocumentRequest,
  getArchivedDocumentRequests,
  restoreDocumentRequest
};