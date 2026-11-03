package com.goldenhearts.support.hub.RegistrationModel;

import jakarta.persistence.*;

@Entity
@Table(name = "registrations")
public class RegistrationModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String applicantName;
    private String phoneNumber;
    private Integer age;
    private String supportRequired;

    private Long homeId;
    private String homeName;
    private String ownerEmail;
    private String status;

    private String address;
    private String photoFileName;

    private String guardianName;
    private String guardianRelationship;
    private String guardianPhoneNumber;

    private String secondContactName;
    private String secondContactRelationship;
    private String secondContactPhoneNumber;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getApplicantName() {
        return applicantName;
    }

    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getSupportRequired() {
        return supportRequired;
    }

    public void setSupportRequired(String supportRequired) {
        this.supportRequired = supportRequired;
    }

    public Long getHomeId() {
        return homeId;
    }

    public void setHomeId(Long homeId) {
        this.homeId = homeId;
    }

    public String getHomeName() {
        return homeName;
    }

    public void setHomeName(String homeName) {
        this.homeName = homeName;
    }

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhotoFileName() {
        return photoFileName;
    }

    public void setPhotoFileName(String photoFileName) {
        this.photoFileName = photoFileName;
    }

    public String getGuardianName() {
        return guardianName;
    }

    public void setGuardianName(String guardianName) {
        this.guardianName = guardianName;
    }

    public String getGuardianRelationship() {
        return guardianRelationship;
    }

    public void setGuardianRelationship(String guardianRelationship) {
        this.guardianRelationship = guardianRelationship;
    }

    public String getGuardianPhoneNumber() {
        return guardianPhoneNumber;
    }

    public void setGuardianPhoneNumber(String guardianPhoneNumber) {
        this.guardianPhoneNumber = guardianPhoneNumber;
    }

    public String getSecondContactName() {
        return secondContactName;
    }

    public void setSecondContactName(String secondContactName) {
        this.secondContactName = secondContactName;
    }

    public String getSecondContactRelationship() {
        return secondContactRelationship;
    }

    public void setSecondContactRelationship(String secondContactRelationship) {
        this.secondContactRelationship = secondContactRelationship;
    }

    public String getSecondContactPhoneNumber() {
        return secondContactPhoneNumber;
    }

    public void setSecondContactPhoneNumber(String secondContactPhoneNumber) {
        this.secondContactPhoneNumber = secondContactPhoneNumber;
    }
}
