package com.example.store.service;
import com.example.store.model.Product;
import com.example.store.repository.ProductRepository;
import org.springframework.stereotype.Service;
import java.util.*;
@Service
public class ProductService {
 private final ProductRepository repo;
 public ProductService(ProductRepository repo){this.repo=repo;}
 public List<Product> all(){return repo.findAll();}
 public Optional<Product> get(Long id){return repo.findById(id);}
 public Product create(Product p){return repo.save(p);}
 public Product update(Long id,Product p){
  return repo.findById(id).map(ex->{
   ex.setName(p.getName());
   ex.setDescription(p.getDescription());
   ex.setPrice(p.getPrice());
   ex.setQuantity(p.getQuantity());
   return repo.save(ex);
  }).orElseThrow();
 }
 public void delete(Long id){repo.deleteById(id);}
}