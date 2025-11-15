package com.example.store.model;
import jakarta.persistence.*;
@Entity
public class Product {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
 private Long id;
 private String name;
 private String description;
 private double price;
 private int quantity;
 public Product() {}
 public Product(String name,String description,double price,int quantity){
  this.name=name;this.description=description;this.price=price;this.quantity=quantity;
 }
 public Long getId(){return id;} public void setId(Long id){this.id=id;}
 public String getName(){return name;} public void setName(String n){this.name=n;}
 public String getDescription(){return description;} public void setDescription(String d){this.description=d;}
 public double getPrice(){return price;} public void setPrice(double p){this.price=p;}
 public int getQuantity(){return quantity;} public void setQuantity(int q){this.quantity=q;}
}