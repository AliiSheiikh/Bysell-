package com.project.Bysell.repository;

import com.project.Bysell.model.ItemImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ItemImageRepository extends JpaRepository<ItemImage, Long> {

    List<ItemImage> findByItemIdOrderByIdAsc(Long itemId);

    Optional<ItemImage> findFirstByItemIdOrderByIdAsc(Long itemId);
}
