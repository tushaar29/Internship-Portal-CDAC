package com.intersify.service;

import com.intersify.dto.CertificateDTO;
import com.intersify.entity.Certificate;

import java.util.List;

public interface CertificateService {
    CertificateDTO issueCertificate(Long applicationId, Long companyId);
    List<CertificateDTO> getCertificatesByStudent(Long studentId);
    CertificateDTO getCertificateById(Long certificateId);
}
