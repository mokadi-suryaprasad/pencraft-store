package com.example.store.controller;
import com.example.store.model.Product;
import com.example.store.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.*;
@RestController
@RequestMapping("/api/products")
public class ProductController {
 private final ProductService svc;
 public ProductController(ProductService svc){this.svc=svc;}
 @GetMapping public List<Product> list(){return svc.all();}
 @GetMapping("/{id}") public ResponseEntity<Product> get(@PathVariable Long id){
  return svc.get(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
 }
 @PostMapping public ResponseEntity<Product> create(@RequestBody Product p){
  Product c=svc.create(p);
  return ResponseEntity.created(URI.create("/api/products/"+c.getId())).body(c);
 }
 @PutMapping("/{id}") public ResponseEntity<Product> update(@PathVariable Long id,@RequestBody Product p){
  try{return ResponseEntity.ok(svc.update(id,p));}
  catch(Exception e){return ResponseEntity.notFound().build();}
 }
 @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id){
  svc.delete(id); return ResponseEntity.noContent().build();
 }
}