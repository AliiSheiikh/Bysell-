package com.project.Bysell.repository;

import com.project.Bysell.model.Item;
import com.project.Bysell.model.ItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> findByStatus(ItemStatus status);

    boolean existsByOwnerId(Long ownerId);
}
