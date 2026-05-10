package com.clms.computer.repository;

import com.clms.computer.entity.Computer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ComputerRepository extends JpaRepository<Computer, String> {

    @Query("SELECT c FROM Computer c JOIN FETCH c.lab WHERE c.lab.id = :labId AND c.isActive = true")
    List<Computer> findByLabIdAndIsActiveTrue(@Param("labId") String labId);

    Optional<Computer> findByIdAndIsActiveTrue(String id);

    Optional<Computer> findByMacAddress(String macAddress);

    @Query("SELECT c FROM Computer c JOIN FETCH c.lab WHERE c.lab.id = :labId")
    List<Computer> findByLabIdWithGrid(@Param("labId") String labId);

    Optional<Computer> findByMacAddressAndLabId(String macAddress, String labId);

    Optional<Computer> findByLabIdAndGridRowAndGridCol(String labId, Integer gridRow, Integer gridCol);

    boolean existsByLabIdAndGridRowAndGridCol(String labId, Integer gridRow, Integer gridCol);

    boolean existsByAssetTag(String assetTag);

    boolean existsByMacAddress(String macAddress);
}
