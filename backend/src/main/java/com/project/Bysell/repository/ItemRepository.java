package com.project.Bysell.repository;

import com.project.Bysell.model.Item;
import com.project.Bysell.model.ItemCategory;
import com.project.Bysell.model.ItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> findByStatus(ItemStatus status);

    boolean existsByOwnerId(Long ownerId);

    @Query("SELECT i FROM Item i WHERE i.status = 'AVAILABLE' "
            + "AND (:keyword IS NULL OR LOWER(i.title) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%'))) "
            + "AND (:category IS NULL OR i.category = :category) "
            + "AND (:minPrice IS NULL OR i.price >= :minPrice) "
            + "AND (:maxPrice IS NULL OR i.price <= :maxPrice)")
    List<Item> search(@Param("keyword") String keyword,
                       @Param("category") ItemCategory category,
                       @Param("minPrice") BigDecimal minPrice,
                       @Param("maxPrice") BigDecimal maxPrice);
}
