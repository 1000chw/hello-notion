package dev.hellonotion

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class HelloNotionApplication

fun main(args: Array<String>) {
    runApplication<HelloNotionApplication>(*args)
}
