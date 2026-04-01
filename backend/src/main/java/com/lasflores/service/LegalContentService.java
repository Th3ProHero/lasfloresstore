package com.lasflores.service;

import com.lasflores.dto.LegalContentDTO;
import com.lasflores.entity.LegalContent;
import com.lasflores.repository.LegalContentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LegalContentService {

    private final LegalContentRepository repository;

    @Transactional(readOnly = true)
    public LegalContentDTO.Response getLatestByType(String type) {
        return repository.findTopByTypeOrderByVersionDesc(type)
                .map(this::mapToResponse)
                .orElseGet(() -> {
                    // Fallback to empty context if nothing exists yet
                    LegalContentDTO.Response empty = new LegalContentDTO.Response();
                    empty.setType(type);
                    empty.setContent("");
                    empty.setVersion(0);
                    return empty;
                });
    }

    @Transactional
    public LegalContentDTO.Response saveContent(String type, LegalContentDTO.Request req) {
        Integer latestVersion = repository.findTopByTypeOrderByVersionDesc(type)
                .map(LegalContent::getVersion)
                .orElse(0);

        LegalContent newContent = new LegalContent();
        newContent.setType(type);
        newContent.setContent(req.getContent());
        newContent.setVersion(latestVersion + 1);

        return mapToResponse(repository.save(newContent));
    }

    private LegalContentDTO.Response mapToResponse(LegalContent entity) {
        LegalContentDTO.Response r = new LegalContentDTO.Response();
        r.setId(entity.getId());
        r.setType(entity.getType());
        r.setContent(entity.getContent());
        r.setVersion(entity.getVersion());
        r.setUpdatedAt(entity.getUpdatedAt() != null ? entity.getUpdatedAt().toString() : null);
        return r;
    }
}
