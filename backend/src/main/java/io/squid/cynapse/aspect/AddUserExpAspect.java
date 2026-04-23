package io.squid.cynapse.aspect;

import io.squid.cynapse.annotation.AddUserExp;
import io.squid.cynapse.entities.User;
import io.squid.cynapse.services.UserService;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @author TopeEstLa
 */
@Aspect
@Component
public class AddUserExpAspect {

    @Autowired
    private UserService userService;

    @AfterReturning(pointcut = "@annotation(addUserExpAnnotation)", returning = "result")
    public Object processExp(AddUserExp addUserExpAnnotation, Object result) throws Throwable {
        User user = this.userService.getCurrentUser();
        if (user == null) return result;

        this.userService.addExpToUser(user, addUserExpAnnotation.exp());
        return result;
    }

}
