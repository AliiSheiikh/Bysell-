package com.project.Bysell.repository;

import com.project.Bysell.model.ItemImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemImageRepository extends JpaRepository<ItemImage, Long> {

    List<ItemImage> findByItemId(Long itemId);
}
